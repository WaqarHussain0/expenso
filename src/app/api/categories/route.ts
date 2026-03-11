import { CategoryService } from "@/backend/modules/category/category.service";
import { CreateCategoryDto } from "@/backend/modules/category/dto/create-category.dto";
import { validateDto } from "@/backend/utils/input-validator.util";
import { NextRequest, NextResponse } from "next/server";

const categoryService = new CategoryService();

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();

    // Transform to DTO and validate
    const dto = await validateDto(CreateCategoryDto, body);

    // Create category using the service
    const category = await categoryService.create(dto);

    // Return success response
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
