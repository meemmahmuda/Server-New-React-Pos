<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SalesReturnController;
use App\Http\Controllers\IncomeStatementController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/dashboard', [DashboardController::class, 'index']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']); 
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{category}', [CategoryController::class, 'update']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

Route::get('/expenses', [ExpenseController::class, 'index']);
Route::post('/expenses', [ExpenseController::class, 'store']);
Route::get('/expenses/{expense}', [ExpenseController::class, 'show']); 
Route::put('/expenses/{expense}', [ExpenseController::class, 'update']);
Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy']);

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{product}', [ProductController::class, 'show']); 
Route::put('/products/{product}', [ProductController::class, 'update']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);

Route::get('/suppliers', [SupplierController::class, 'index']);
Route::get('/suppliers/{supplier}', [SupplierController::class, 'show']); 
Route::post('/suppliers', [SupplierController::class, 'store']);
Route::put('/suppliers/{supplier}', [SupplierController::class, 'update']);
Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy']);

Route::get('/orders/report/pdf', [OrderController::class, 'generatePdf'])->name('orders.report.pdf');

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{order}', [OrderController::class, 'show']);
Route::put('/orders/{order}', [OrderController::class, 'update']);
Route::delete('/orders/{order}', [OrderController::class, 'destroy']);

Route::get('/suppliers/{id}', [SupplierController::class, 'show']);

Route::get('/suppliers/{supplier}/print', [SupplierController::class, 'printSupplierDetails'])->name('suppliers.print');

Route::get('/sales/report', [SaleController::class, 'report']);
Route::get('/sales', [SaleController::class, 'index']);
Route::post('/sales', [SaleController::class, 'store']);
Route::get('/sales/{sale}', [SaleController::class, 'show']); 
Route::put('/sales/{sale}', [SaleController::class, 'update']);
Route::delete('/sales/{sale}', [SaleController::class, 'destroy']);


Route::get('/sales/{customerName}', [SaleController::class, 'show'])->name('sales.show');

Route::get('/sales/report/pdf', [SaleController::class, 'generateReportPdf']);


Route::get('sales/{saleId}/pdf', [SaleController::class, 'generateSalePdf']);


Route::get('/sales_returns', [SalesReturnController::class, 'index']);
Route::post('/sales_returns', [SalesReturnController::class, 'store']);
Route::delete('/sales_returns/{salesReturn}', [SalesReturnController::class, 'destroy']);

Route::get('/purchases/report', [OrderController::class, 'report'])->name('orders.report');

Route::get('/income-statement', [IncomeStatementController::class, 'index']);

Route::get('/income-statement/pdf', [IncomeStatementController::class, 'generatePDF'])->name('income_statement.pdf');















