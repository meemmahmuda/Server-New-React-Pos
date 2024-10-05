<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use PDF;

class OrderController extends Controller
{
    // Display a listing of the orders

    
        // Display a listing of the orders
        public function index()
        {
            // Get all suppliers who have made purchases
            $suppliers = Supplier::has('orders')->get();
            
            // Return JSON response
            return response()->json($suppliers);
        }
        
        public function show($id)
        {
            // Find the supplier by ID and eager load orders and products
            $supplier = Supplier::with('orders.product')->findOrFail($id);
            
            // Return JSON response
            return response()->json($supplier);
        }
    
        // Show the form for creating a new order (optional in API context)
        public function create()
        {
            // Load products with their suppliers
            $products = Product::with('supplier')->get();
            
            // Return JSON response
            return response()->json($products);
        }
    
        // Store a newly created order in the database
        public function store(Request $request)
        {
            // Validate the request input
            $request->validate([
                'order_data' => 'required', // Add validation for the serialized order data
                'amount_given' => 'required|integer|min:0',
            ]);
    
            // Decode the order data
            $orders = json_decode($request->order_data, true);
    
            // Iterate through the orders and store them
            foreach ($orders as $order) {
                // Find the product and calculate total price
                $product = Product::findOrFail($order['product_id']);
                $totalPrice = $product->purchase_price * $order['quantity'];
    
                // Update the product stock
                $product->stock = ($product->stock ?? 0) + $order['quantity'];
                $product->save();  // Save the updated stock
    
                // Create the new order
                Order::create([
                    'product_id' => $product->id,
                    'supplier_id' => $product->supplier_id,
                    'quantity' => $order['quantity'],
                    'purchase_price' => $product->purchase_price,
                    'total_price' => $totalPrice,
                    'amount_given' => $request->amount_given,
                    'amount_return' => $request->amount_return,
                ]);
            }
    
            // Return a JSON response indicating success
            return response()->json(['message' => 'Order created successfully.'], 201);
        }

        public function getReportData(Request $request)
        {
            $date = $request->input('date');
            $month = $request->input('month');
            $reportData = [];
        
            // Logic to fetch report data based on date
            if ($date) {
                $reportData = Order::whereDate('created_at', $date)
                    ->with('supplier', 'product') // Assuming relationships exist for supplier and product
                    ->get()
                    ->map(function($order) {
                        return [
                            'supplier' => $order->supplier->name ?? 'N/A',
                            'product_name' => $order->product->name ?? 'N/A',
                            'quantity' => $order->quantity,
                            'purchase_price' => $order->purchase_price,
                            'total_price' => $order->quantity * $order->purchase_price,
                        ];
                    });
            }
            // Logic to fetch report data based on month
            elseif ($month) {
                $reportData = Order::whereMonth('created_at', $month)
                    ->with('supplier', 'product') // Assuming relationships exist for supplier and product
                    ->get()
                    ->map(function($order) {
                        return [
                            'supplier' => $order->supplier->name ?? 'N/A',
                            'product_name' => $order->product->name ?? 'N/A',
                            'quantity' => $order->quantity,
                            'purchase_price' => $order->purchase_price,
                            'total_price' => $order->quantity * $order->purchase_price,
                        ];
                    });
            }
        
            // Return the data as JSON response
            return response()->json([
                'success' => true,
                'data' => $reportData,
                'date' => $date,
                'month' => $month,
            ]);
        }


        public function generatePdf(Request $request)
        {
            $date = $request->input('date');
            $month = $request->input('month');
            $reportData = [];
        
            // Logic to fetch report data based on date
            if ($date) {
                $reportData = Order::whereDate('created_at', $date)
                    ->with('supplier', 'product') // Assuming relationships exist for supplier and product
                    ->get()
                    ->map(function($order) {
                        return [
                            'supplier' => $order->supplier->name ?? 'N/A',
                            'product_name' => $order->product->name ?? 'N/A',
                            'quantity' => $order->quantity,
                            'purchase_price' => $order->purchase_price,
                            'total_price' => $order->quantity * $order->purchase_price,
                        ];
                    });
            }
        
            // Logic to fetch report data based on month
            elseif ($month) {
                $reportData = Order::whereMonth('created_at', $month)
                    ->with('supplier', 'product') // Assuming relationships exist for supplier and product
                    ->get()
                    ->map(function($order) {
                        return [
                            'supplier' => $order->supplier->name ?? 'N/A',
                            'product_name' => $order->product->name ?? 'N/A',
                            'quantity' => $order->quantity,
                            'purchase_price' => $order->purchase_price,
                            'total_price' => $order->quantity * $order->purchase_price,
                        ];
                    });
            }
        
            // Load the view and pass data to it
            $pdf = PDF::loadView('orders.orders-pdf', [
                'reportData' => $reportData,
                'date' => $date,
                'month' => $month,
            ]);
        
            // Return the generated PDF
            return $pdf->download('purchase_report.pdf');
        }
        
       


        public function report(Request $request)
        {
            // Get the date and month from the request
            $date = $request->input('date');
            $month = $request->input('month');
        
            // Initialize the query for orders with related products and suppliers
            $query = Order::with('product.supplier');
        
            // Filter by date if provided
            if ($date) {
                $query->whereDate('created_at', $date);
            }
            // Filter by month if provided (ignore date)
            elseif ($month) {
                $year = now()->year;
                $startDate = "$year-$month-01"; // Start of the month
                $endDate = now()->setYear($year)->setMonth($month)->endOfMonth()->format('Y-m-d'); // End of the month
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
            // If neither date nor month is provided, use today's date
            else {
                $date = now()->format('Y-m-d');
                $query->whereDate('created_at', $date);
            }
        
            // Fetch orders and eager load relationships
            $orders = $query->get();
        
            // Initialize array to store report data
            $reportData = [];
        
            foreach ($orders as $order) {
                $product = $order->product;
                $supplier = $product->supplier->name ?? 'N/A'; // Ensure supplier exists
                $productName = $product->name;
                $quantity = $order->quantity;
                $purchasePrice = $order->purchase_price;
                $totalPrice = $order->total_price;
        
                // Add data to report array
                $reportData[] = [
                    'supplier' => $supplier,
                    'product_name' => $productName,
                    'quantity' => $quantity,
                    'purchase_price' => number_format($purchasePrice, 2),
                    'total_price' => number_format($totalPrice, 2),
                ];
            }
        
            // Return JSON response
            return response()->json([
                'reportData' => $reportData,
                'selectedDate' => $date,
                'selectedMonth' => $month
            ]);
        }
        
    
    
    
    
}
