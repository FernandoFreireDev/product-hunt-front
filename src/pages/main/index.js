import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './styles.css';
import api from './../../services/api';

export default class Main extends Component {

    state = {
        products: [],
        productInfo: {},
        page: 1,
        searchLimit: 10
    }

    componentDidMount() {
        this.loadProducts();
    }

    loadProducts = async (page = 1, limit = 10) => {
        const response = await api.get(`/products?page=${page}&limit=${limit}`);

        const { docs, ...productInfo } = response.data;
        this.setState({ products: docs, productInfo, page });
    };

    prevPage = () => {
        const { page, productInfo, searchLimit } = this.state;

        if (page === 1) return;

        const pageNumber = page - 1;

        this.loadProducts(pageNumber, searchLimit);
    }

    nextPage = () => {
        const { page, productInfo, searchLimit } = this.state;

        if(page === productInfo.pages) return;

        const pageNumber = page + 1;

        this.loadProducts(pageNumber, searchLimit);
    }

    handleSearchLimit = async (event) => {
        await this.setState({ searchLimit: event.target.value });
        const { page, searchLimit } = this.state;
        this.loadProducts(page, searchLimit);
    }

    render() {

        const { products, page, productInfo } = this.state;

        return (
            <div className="product-list">
                <div className="search-parameters">
                    <select className="product-limit" onChange={this.handleSearchLimit}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="10">100</option>
                    </select>
                </div>
                {products.map(product => (
                    <article key={product._id}>
                        <strong>{product.title}</strong>
                        <p>{product.description}</p>

                        <Link to={`/products/${product._id}`}>Acessar</Link>
                    </article>
                ))}
                <div className="actions">
                    <button disabled={page === 1} onClick={this.prevPage}>Anterior</button>
                    <button disabled={page === productInfo.pages} onClick={this.nextPage}>Próximo</button>
                </div>
            </div>
        )
    }
}