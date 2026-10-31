import { useState, useEffect } from 'react';
import './index.css';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');
    const [showForm, setShowForm] = useState(false);

const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: ''
});

// Получение товаров
const loadProducts = async () => {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
};

useEffect(() => {
    loadProducts();
}, []);

// Добавление товара
const addProduct = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Ошибка добавления');
            return;
        }

        setForm({
            name: '',
            description: '',
            price: '',
            image: '',
            category: ''
        });

        setShowForm(false);
        loadProducts();

    } catch (error) {
        console.error(error);
        alert('Не удалось добавить товар');
    }
};

// Удаление товара
const deleteProduct = async (id) => {
    if (!confirm('Удалить этот товар?')) return;

    try {
        const response = await fetch(`/api/products?id=${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadProducts();
        } else {
            alert('Не удалось удалить товар');
        }
    } catch (error) {
        console.error(error);
    }
};

// Поиск и фильтрация
let filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
);

if (category) {
    filteredProducts = filteredProducts.filter(
        product => product.category === category
    );
}

if (sort === 'asc') {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
} else if (sort === 'desc') {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
}

const categories = [...new Set(products.map(product => product.category))];

return (
    <div className="app">

        <header className="header">
            <div className="logo">TECH<span>STORE</span></div>

            <div className="header-info">
                Каталог компьютерной техники
            </div>

            <button
                className="add-button"
                onClick={() => setShowForm(!showForm)}
            >
                + Добавить товар
            </button>
        </header>

        <main className="container">

            <section className="intro">
                <h1>Каталог техники</h1>
                <p>Всё необходимое для работы, учёбы и развлечений</p>
            </section>

            {showForm && (
                <form className="product-form" onSubmit={addProduct}>
                    <h2>Добавление товара</h2>

                    <input
                        type="text"
                        placeholder="Название товара"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        required
                    />

                    <textarea
                        placeholder="Описание товара"
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Цена"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={e => setForm({...form, price: e.target.value})}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Путь к изображению, например /img/mouse.jpeg"
                        value={form.image}
                        onChange={e => setForm({...form, image: e.target.value})}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Категория"
                        value={form.category}
                        onChange={e => setForm({...form, category: e.target.value})}
                        required
                    />

                    <button type="submit">Сохранить товар</button>
                </form>
            )}

            <section className="filters">

                <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value="">Все категории</option>

                    {categories.map(item => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    <option value="">Без сортировки</option>
                    <option value="asc">Сначала дешёвые</option>
                    <option value="desc">Сначала дорогие</option>
                </select>

            </section>

            <div className="products-count">
                Найдено товаров: {filteredProducts.length}
            </div>

            <section className="products">

                {filteredProducts.map(product => (
                    <article className="product-card" key={product.id}>

                        <div className="product-image">
                            <img
                                src={product.image}
                                alt={product.name}
                                onError={e => {
                                    e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
                                }}
                            />
                        </div>

                        <div className="product-content">

                            <span className="category">
                                {product.category}
                            </span>

                            <h3>{product.name}</h3>

                            <p>{product.description}</p>

                            <div className="product-bottom">
                                <strong>
                                    {Number(product.price).toLocaleString('ru-RU')} ₽
                                </strong>

                                <button
                                    className="delete-button"
                                    onClick={() => deleteProduct(product.id)}
                                >
                                    Удалить
                                </button>
                            </div>

                        </div>
                    </article>
                ))}

            </section>

            {filteredProducts.length === 0 && (
                <div className="empty">
                    Товары не найдены
                </div>
            )}

        </main>

        <footer>
            TECHSTORE © 2026
        </footer>

    </div>
);
}

export default App;