import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { validateItemData } from "@/utils/apiHelpers";


const prisma = new PrismaClient();


export async function POST(req) {
    let body;

    // Försök att läsa JSON-kroppen från begäran
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({
            message: "A valid JSON object has to be sent"
        }, {
            status: 400
        });
    }

    // Validering av skickade data
    const [hasErrors, errors] = validateItemData(body);
    if (hasErrors) {
        return NextResponse.json({
            message: errors
        }, {
            status: 400
        });
    }

    // Försök att skapa ett nytt item
    try {
        const newItem = await prisma.item.create({
            data: {
                name: body.name,
                description: body.description,
                quantity: body.quantity,
                category: body.category || "Misc",  // Standardkategori om ingen anges
            }
        });

        return NextResponse.json(newItem, { status: 201 });  // Returnerar det skapade objektet med status 201 (Created)
    } catch (error) {
        return NextResponse.json({
            message: "Failed to create the item: " + error.message
        }, {
            status: 500
        });
    }
}


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const inStock = searchParams.get("inStock"); // Now a string ("true" or "false")
  
    const whereClause = {};
  
    // Filter by category if provided
    if (category) {
      whereClause.category = category;
    }
  
    // Filter by inStock (true: quantity > 0, false: quantity = 0)
    if (inStock) {
      whereClause.quantity = inStock === "true" ? { gt: 0 } : { equals: 0 };
      console.log("WhereClause:", whereClause);
    }
  
    try {
      const items = await prisma.item.findMany({
        where: whereClause,
      });
      return NextResponse.json(items);
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        message: "Failed to fetch items",
      }, {
        status: 500,
      });
    }
  }

 