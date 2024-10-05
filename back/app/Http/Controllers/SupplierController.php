<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use PDF;

class SupplierController extends Controller
{
    // Fetch all suppliers
    public function index()
    {
        $suppliers = Supplier::orderBy('created_at', 'desc')->get();
        return response()->json(['suppliers' => $suppliers], 200);
    }

    // Print supplier details as PDF
    public function printSupplierDetails($id)
    {
        $supplier = Supplier::with('orders.product')->findOrFail($id);
    
        // Load the PDF view and pass the supplier data
        $pdf = PDF::loadView('suppliers.pdf', compact('supplier'));
    
        return $pdf->stream('supplier-details.pdf'); // or ->download() to force download
    }

    // Fetch a single supplier with related orders and products
    public function show($id)
    {
        $supplier = Supplier::with('orders.product')->findOrFail($id);
        return response()->json(['supplier' => $supplier], 200);
    }

    // Return necessary data for supplier creation (if needed)
    public function create()
    {
        return response()->json(['message' => 'Create new supplier form'], 200);
    }

    // Store a new supplier from React
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'nullable|string',
        ]);

        $supplier = Supplier::create($validatedData);

        return response()->json(['message' => 'Supplier created successfully', 'supplier' => $supplier], 201);
    }

    // Fetch data to edit an existing supplier
    public function edit(Supplier $supplier)
    {
        return response()->json(['supplier' => $supplier], 200);
    }

    // Update a supplier's details
    public function update(Request $request, Supplier $supplier)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
        ]);

        $supplier->update($validatedData);

        return response()->json(['message' => 'Supplier updated successfully', 'supplier' => $supplier], 200);
    }

    // Delete a supplier
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return response()->json(['message' => 'Supplier deleted successfully'], 200);
    }
}
