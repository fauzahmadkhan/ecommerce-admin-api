# E-Commerce Admin API

## Description

This project is a Node.js backend API built with NestJS, providing e-commerce functionality for inventory management, sales tracking, and analytics. It follows RESTful principles and uses MongoDB as the database.

## Prerequisites
    Node.js (v18+)

    MongoDB (v6+)

    yarn

## Project setup

```bash
$ yarn install
```

## Set up environment variables

    .env-example file is provided which contains sensitive data for the .env file

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Tech Stack
    Framework	NestJS

    Language	TypeScript

    API Type	RESTful

    Database	MongoDB

    Authentication	JWT

## API Endpoints

### Swagger Documentation

    http://localhost:4000/api/v1#/

### Sales

    /sale/place	POST	Create a new sale (transaction-safe)
    
    /sale/list-customer-sales	GET	Get sales by customer ID

    /sale/get/{saleId}	GET	Fetch sale details by ID

    /sale/get-sales-by-status	GET	Filter sales by status

    /sale/get-sales-analytics	POST	Get sales trends (daily/weekly/etc.)

    /sale/get-sales-comparison	POST	Compare sales between two periods

    /sale/get-sales-by-product	GET	Top-selling products report

### Inventory

    /inventory/status	GET	Check low-stock items

    /inventory/update-availability	POST	Toggle product availability

    /inventory/move-product	POST	Transfer product between inventories

    /inventory/history/{productId}	GET	View inventory change history


## Database Schema
The system uses MongoDB with the following collections:

    Sales - Tracks customer orders, status, and payments.

    Inventory - Manages product groupings and availability.

    Products - Stores item details (price, availability).

    Customers - User account and purchase history.

    InventoryHistory - Logs inventory changes (audit trail).
