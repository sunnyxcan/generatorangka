// app/api/generate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { num_digits, min_value, max_value, duplicate_option } = await request.json();

    const countToGenerate = parseInt(num_digits as string, 10);
    const minVal = parseInt(min_value as string, 10);
    const maxVal = parseInt(max_value as string, 10);
    const duplicateOption = duplicate_option as string;

    if (isNaN(countToGenerate) || isNaN(minVal) || isNaN(maxVal)) {
      return NextResponse.json({ error: "Input tidak valid. Harap masukkan angka untuk semua field." }, { status: 400 });
    }

    if (countToGenerate <= 0) {
      return NextResponse.json({ error: "Jumlah angka yang digenerate harus lebih dari 0." }, { status: 400 });
    }

    if (minVal > maxVal) {
      return NextResponse.json({ error: "Nilai minimum tidak boleh lebih besar dari nilai maksimum." }, { status: 400 });
    }

    let randomNumbersList: number[] | string[];
    if (duplicateOption === 'allow_duplicates') {
      randomNumbersList = Array.from({ length: countToGenerate }, () =>
        Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
      );
    } else if (duplicateOption === 'unique_numbers') {
      const rangeSize = maxVal - minVal + 1;
      if (countToGenerate > rangeSize) {
        return NextResponse.json({ error: `Tidak bisa menghasilkan ${countToGenerate} angka unik dalam rentang ${minVal}-${maxVal}. Rentang terlalu kecil.` }, { status: 400 });
      }
      const numbers = new Set<number>();
      while (numbers.size < countToGenerate) {
        numbers.add(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
      }
      randomNumbersList = Array.from(numbers);
    } else {
      return NextResponse.json({ error: "Opsi duplikat tidak valid." }, { status: 400 });
    }

    // Format output
    let generatedOutput: string;
    if (typeof randomNumbersList[0] === 'number' && (maxVal > 9 || minVal < 0)) {
        generatedOutput = randomNumbersList.join(" ");
    } else {
        generatedOutput = randomNumbersList.join("");
    }
    
    // Simulate some delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({ generated_output: generatedOutput });
  } catch (error) {
    console.error("Error generating numbers:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan." }, { status: 500 });
  }
}