<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();  // Creates 'unsignedBigInteger'
            $table->unsignedBigInteger('supplier_id');  // Foreign key to 'suppliers.id'
            $table->unsignedBigInteger('category_id');  // Change back to 'unsignedBigInteger'
            $table->string('name');
            $table->string('code')->unique();
            $table->integer('purchase_price');
            $table->integer('selling_price');
            $table->integer('stock')->nullable(); 
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
