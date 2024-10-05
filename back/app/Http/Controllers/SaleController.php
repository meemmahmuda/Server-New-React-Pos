<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use PDF;
use Illuminate\Support\Facades\Log;

class SaleController extends Controller
{
    // Display a listing of the sales
// Display a listing of the sales
public function index()
    {
        // Get all sales grouped by customer name
        $sales = Sale::with('product')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('customer_name'); // Group sales by customer name

        // Return sales as JSON response
        return response()->json([
            'sales' => $sales,
            'message' => 'Sales fetched successfully'
        ], 200);
    }

    // Show the form for creating a new sale (fetch products for sale)
    public function create()
    {
        // Load available products
        $products = Product::where('stock', '>', 0)->get();

        // Return products as JSON response
        return response()->json([
            'products' => $products,
            'message' => 'Products fetched successfully'
        ], 200);
    }

    // Show sales for a specific customer by customer name
    public function show($customerName)
    {
        // Get sales for the given customer name
        $sales = Sale::where('customer_name', $customerName)
            ->with('product')
            ->get();

        // Check if sales exist for the customer
        if ($sales->isEmpty()) {
            return response()->json([
                'message' => 'No sales found for this customer'
            ], 404);
        }

        // Return sales for the customer as JSON response
        return response()->json([
            'sales' => $sales,
            'customerName' => $customerName,
            'message' => 'Sales fetched successfully'
        ], 200);
    }

    // Store a new sale
    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'money_taken' => 'required|numeric|min:0',
            'sales_data' => 'required|json', // Validate the sales data as JSON
            'customer_name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone_no' => 'nullable|string|max:20',
        ]);

        // Decode the sales data from JSON
        $salesData = json_decode($request->sales_data, true);
        $totalSalesAmount = 0;

        // Begin a transaction for creating multiple sales
        \DB::beginTransaction();

        try {
            foreach ($salesData as $sale) {
                $product = Product::findOrFail($sale['product_id']);

                // Check product stock availability
                if ($product->stock < $sale['quantity']) {
                    return response()->json([
                        'error' => 'The quantity cannot be greater than the available stock.'
                    ], 400);
                }

                // Calculate subtotal, discount, and total price
                $subtotal = $product->selling_price * $sale['quantity'];
                $totalSalesAmount += $subtotal;

                // Create the sale
                Sale::create([
                    'customer_name' => $request->customer_name,
                    'address' => $request->address,
                    'phone_no' => $request->phone_no,
                    'product_id' => $product->id,
                    'quantity' => $sale['quantity'],
                    'selling_price' => $product->selling_price,
                    'total_price' => $subtotal,
                    'discount' => $sale['discount'] ?? 0,
                    'money_taken' => $request->money_taken,
                    'money_returned' => max($request->money_taken - $totalSalesAmount, 0),
                ]);

                // Decrement product stock
                $product->decrement('stock', $sale['quantity']);
            }

            // Commit the transaction
            \DB::commit();

            // Return success response
            return response()->json([
                'message' => 'Sale created successfully!'
            ], 201);

        } catch (\Exception $e) {
            // Rollback the transaction in case of any errors
            \DB::rollBack();

            return response()->json([
                'error' => 'An error occurred while creating the sale.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    
    
    
  
public function generateSalePdf($saleId)
    {
        // Fetch the sale and related customer information
        $sales = Sale::where('id', $saleId)->get();
        $customerName = $sales->first()->customer_name;
    
        // Load the view and pass the sales and customer data
        $pdf = PDF::loadView('sales.sale_pdf', compact('sales', 'customerName'));
    
        // Return the generated PDF as a download
        return $pdf->download('sale-details.pdf');
    }


    public function generateReportPdf(Request $request)
{
    // Get the date and month from the request
    $date = $request->input('date');
    $month = $request->input('month');
    
    // Initialize the query
    $query = Sale::with('product.category');
    
    // Filter by date if provided
    if ($date) {
        $query->whereDate('created_at', $date);
    }
    // Filter by month if provided (ignore date)
    elseif ($month) {
        $year = now()->year;
        $startDate = "$year-$month-01";
        $endDate = now()->year($year)->month($month)->endOfMonth()->format('Y-m-d');
        $query->whereBetween('created_at', [$startDate, $endDate]);
    }
    // Use today's date if neither date nor month is provided
    else {
        $date = now()->format('Y-m-d');
        $query->whereDate('created_at', $date);
    }

    // Fetch sales data
    $sales = $query->get();
    
    // Prepare report data for PDF
    $reportData = [];
    foreach ($sales as $sale) {
        $category = $sale->product->category->name;
        $productName = $sale->product->name;
        $unitsSold = $sale->quantity;
        $unitPrice = $sale->selling_price;
        $discount = $sale->discount;
        $subtotal = $unitPrice * $unitsSold;
        $discountAmount = ($discount / 100) * $subtotal;
        $totalSales = $subtotal;
        $netSales = $subtotal - $discountAmount;

        $reportData[] = [
            'category' => $category,
            'product_name' => $productName,
            'units_sold' => $unitsSold,
            'unit_price' => number_format($unitPrice, 2),
            'discount' => number_format($discountAmount, 2),
            'total_sales' => number_format($totalSales, 2),
            'net_sales' => number_format($netSales, 2),
        ];
    }
    
    // Generate PDF using the view
    $pdf = PDF::loadView('sales.report_pdf', compact('reportData', 'date', 'month'));
    
    // Return the PDF as a download
    return $pdf->download('sales_report.pdf');
}

  


    // Remove the specified sale from the database
    public function destroy(Sale $sale)
    {
        // Restore the product stock
        $product = Product::findOrFail($sale->product_id);
        $product->increment('stock', $sale->quantity);

        // Delete the sale
        $sale->delete();

        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
    }

  
    
    public function report(Request $request)
    {
        // Get the date and month from the request
        $date = $request->input('date');
        $month = $request->input('month');
        
        // Initialize the query
        $query = Sale::with('product.category');
        
        // Filter by date if provided
        if ($date) {
            // Ensure the date is in Y-m-d format
            $query->whereDate('created_at', $date);
        }
        // Filter by month if provided (ignore date)
        elseif ($month) {
            $year = now()->year;
            $startDate = "$year-$month-01";
            // Ensure the end date includes the last day of the month
            $endDate = now()->year($year)->month($month)->endOfMonth()->format('Y-m-d');
            $query->whereBetween('created_at', [$startDate, $endDate]);
        } 
        // If neither date nor month is provided, use today's date
        else {
            $date = now()->format('Y-m-d');
            $query->whereDate('created_at', $date);
        }
        
        // Fetch sales data and eager load relationships
        $sales = $query->get();
        
        // Initialize array to store report data
        $reportData = [];
        
        foreach ($sales as $sale) {
            $category = $sale->product->category->name;
            $productName = $sale->product->name;
            $unitsSold = $sale->quantity;
            $unitPrice = $sale->selling_price;
            $discount = $sale->discount;
            
            // Calculate total sales and net sales
            $subtotal = $unitPrice * $unitsSold;
            $discountAmount = ($discount / 100) * $subtotal;
            $totalSales = $subtotal;
            $netSales = $subtotal - $discountAmount;
    
            // Add data to report array
            $reportData[] = [
                'category' => $category,
                'product_name' => $productName,
                'units_sold' => $unitsSold,
                'unit_price' => number_format($unitPrice, 2),
                'discount' => number_format($discountAmount, 2),
                'total_sales' => number_format($totalSales, 2),
                'net_sales' => number_format($netSales, 2),
            ];
        }
        
        // Return JSON response instead of a view
        return response()->json([
            'reportData' => $reportData,
            'selectedDate' => $date,
            'selectedMonth' => $month,
            'message' => 'Report generated successfully',
        ]);
    }
    
    

}