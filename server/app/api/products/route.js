import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        let result;

        if (search) {
            result = await pool.query(
                'SELECT * FROM products WHERE name ILIKE $1 ORDER BY id DESC',
                [`%${search}%`]
            );
        } else {
            result = await pool.query(
                'SELECT * FROM products ORDER BY id DESC'
            );
        }

        return NextResponse.json(result.rows);

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: 'Ошибка получения товаров' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { name, description, image, price } = await request.json();

        if (!name || price === undefined || Number(price) <= 0 || !Number.isFinite(Number(price))) {
            return NextResponse.json(
                { error: 'Заполните название и укажите корректную цену' },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `INSERT INTO products (name, description, image, price)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, description || '', image || '', Number(price)]
        );

        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: 'Ошибка добавления товара' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || !/^\d+$/.test(id)) {
            return NextResponse.json(
                { error: 'Некорректный ID товара' },
                { status: 400 }
            );
        }

        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: 'Товар не найден' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Товар удалён'
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: 'Ошибка удаления товара' },
            { status: 500 }
        );
    }
}