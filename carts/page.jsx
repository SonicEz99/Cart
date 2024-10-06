"use client";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AUTH from "../components/authComponents";
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit'; // Import fontkit



function Page() {
  const [products, setProducts] = useState([]);
  const { data: session } = useSession();
  const [subtotal, setSubtotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const fetchPrice = async () => {
    if (session) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/cartsession/${session.user.id}`
        );
        const data = await response.json();

        const total = data.reduce((acc, item) => {
          return acc + item.product.price;
        }, 0);

        setSubtotal(total);
        console.log("Subtotal:", total);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
  };

  const fetchProducts = async () => {
    if (session) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/cartsession/${session.user.id}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };

  useEffect(() => {
    fetchPrice();
    fetchProducts();
  }, [session]);

  // Function to handle deletion of a product
  const handleDelete = async (productId) => {
    if (session) {
      // Show SweetAlert confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/cartsession/${session.user.id}/products/${productId}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            Swal.fire({
              title: "Deleted!",
              text: "Your product has been deleted.",
              icon: "success",
            });
            fetchPrice();
            fetchProducts();
          } else {
            const errorData = await response.json();
            console.error("Failed to delete product:", errorData.error);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the product.",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire({
            title: "Error!",
            text: "An unexpected error occurred.",
            icon: "error",
          });
        }
      }
    }
  };

  const createReceiptPDF = async () => {
    
    const fontUrl = '/fonts/NotoSans-Regular.ttf'; // Adjust the path as necessary
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
  
    
    const pdfDoc = await PDFDocument.create();
  
    
    pdfDoc.registerFontkit(fontkit);
  
  
    const font = await pdfDoc.embedFont(fontBytes);
  
    const page = pdfDoc.addPage([600, 400]);
  
    const fontSize = 20;
    const textColor = rgb(0, 0, 0);
  
   
    page.drawText(`Thank You, ${session.user.name}!`, {
      x: 50,
      y: 350,
      size: fontSize,
      color: textColor,
      font: font, // Use the custom font
    });
  
    // Add total price
    page.drawText(`Total Price: ${subtotal.toFixed(2)} Baht`, {
      x: 50,
      y: 300,
      size: fontSize,
      color: textColor,
      font: font, // Use the custom font
    });
  
    // Add product list
    page.drawText('Game List:', {
      x: 50,
      y: 250,
      size: fontSize,
      color: textColor,
      font: font, // Use the custom font
    });
  
    let yPosition = 220; // Starting position for the product list
    products.forEach((item) => {
      page.drawText(`${item.product.name} - ${item.product.price} Baht`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: textColor,
        font: font, // Use the custom font
      });
      yPosition -= 30; // Decrease y position for the next item
    });
  
    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();
  
    // Create a blob and download the PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${session.user.id}.pdf`; // Set the desired file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const handlePayment = async () => {
    
    await Swal.fire({
      title: "Thank You!",
      text: "Your payment has been processed successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });

    createReceiptPDF();
  
    
    if (session) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/cartsession/${session.user.id}`, // Adjust the endpoint as needed
          {
            method: "DELETE",
          }
        );
  
        if (response.ok) {
          
          Swal.fire({
            title: "Cart Cleared!",
            text: "All items have been removed from your cart.",
            icon: "success",
          });
          fetchProducts(); 
          setSubtotal(0); 
        } else {
          const errorData = await response.json();
          console.error("Failed to clear cart:", errorData.error);
          Swal.fire({
            title: "Error!",
            text: "Failed to clear the cart.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        Swal.fire({
          title: "Error!",
          text: "An unexpected error occurred while clearing the cart.",
          icon: "error",
        });
      }
    }
  
    toggleModal(); 
  };

  return (
    <AUTH>
      <div className="flex flex-col justify-center items-center w-full mt-5 mb-5">
        <h1 className="text-3xl">LIST CART</h1>
        <div className="my-5 flex w-full justify-center gap-5">
          <div className="flex flex-col justify-end items-center">
            <h1>ราคารวมโดยประมาณ ${subtotal.toFixed(2)}</h1>
            <p>หากมีภาษีการขาย ก็จะนำมาคำนวณในขั้นตอนการชำระเงิน</p>
            <button 
              onClick={toggleModal} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              ดำเนินการต่อไปเพื่อการชำระเงิน
            </button>
          </div>
        </div>

    
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-[#1E1E24] rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
              <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
              <h3 className="text-lg">Total Price: ฿{subtotal.toFixed(2)}</h3>
              <h4 className="mt-2 font-semibold">Product List:</h4>
              <ul className="list-disc ml-5">
                {products.map((item) => (
                  <li key={item.product.id}>
                    {item.product.name} - ฿{item.product.price}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-4">
                <button
                  onClick={toggleModal} 
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-2"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePayment} 
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex bg-[#212A40] p-4 rounded-lg shadow-lg"
            >
              <div className="flex-shrink-0">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-[300px] h-[200px] object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-col justify-between ml-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {item.product.name}
                  </h2>
                  <p className="text-2xl font-semibold text-white">
                    ฿{item.product.price}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    หากมีภาษีการขาย จะต้องมาคำนวณในขั้นตอนการชำระเงิน
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {item.product.description}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item.product.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  ลบสินค้า
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AUTH>
  );
}

export default Page;
