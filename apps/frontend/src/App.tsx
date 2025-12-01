import React, { useState } from 'react';
import { Skull, ShoppingCart, Search, Menu, Heart, Clock, Truck, Shield, Star, X, Plus, Minus, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

import ReactGA from "react-ga4";
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-MSQENXX4ER';
ReactGA.initialize(GA_TRACKING_ID, {
  gtagOptions: {
    'js': new Date(),
    'config': GA_TRACKING_ID,
  }
});
ReactGA.send("pageview");

interface Product {
  id: number;
  name: string;
  material: string;
  size: string;
  price: number;
  full_price?: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutFormData {
  email: string;
  instagram: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

const products: Product[] = [
  {
    id: 14,
    name: 'Necklace “Carol of The Goat”',
    price: 280,
    image: 'goods/item14.jpg',
    material: 'Brass, polymer clay.',
    size: '43.6 cm, adjustable up to 50 cm.'
  },
  {
    id: 12,
    name: 'Soft Dreams Earrings',
    price: 100,
    image: 'goods/item12.jpg',
    material: 'Stainless steel, polymer clay',
    size: 'Length: 12.3 cm, Width: 2.3 cm'
  },
  {
    id: 13,
    name: 'Dweller of Red Glimmers',
    price: 100,
    image: 'goods/item13.jpg',
    material: 'Polymer clay, metal frame, UV resin',
    size: 'Height: 6.2 cm, Width with wings: 8.2 cm, Body width: 3.3 cm'
  },
  {
    id: 1,
    name: "'Tarot' Earrings",
    price: 250,
    full_price: 250,
    image: "goods/item1.jpg",
    size: 'Length: 11.5 cm (4.5 inches), Width: 3.5 cm (1.4 inches)',
    material: 'Polymer clay and stainless steel',
  },
  {
    id: 2,
    name: "'Engraved Midnight' Earrings",
    price: 150,
    full_price: 200,
    image: "goods/item2.jpg",
    size: 'Length: 11 cm (4.3 inches), Width: 3.5 cm (1.4 inches)',
    material: 'Polymer clay and stainless steel',
  },
  {
    id: 3,
    name: "Choker with Pendant 'Bloody Beam'",
    price: 116,
    full_price: 160,
    image: "goods/item3.jpg",
    size: 'Pendant length (including bead dangles): 12.5 cm  Pendant width: 3.5 cm  Ribbon length: 42 cm (adjustable from 37 cm to 42 cm)',
    material: 'Polymer clay, UV resin, velvet ribbon, stainless steel, glass beads',
  },
  {
    id: 4,
    name: "Earrings 'Jack's Smile'",
    price: 56,
    full_price: 70,
    image: "goods/item4.jpg",
    size: 'Length: 5.5 cm Charm size: 2.6 cm × 2.3 cm',
    material: 'Polymer clay and stainless steel',
  },
  {
    id: 5,
    name: "Brooch 'Secrets of Forest Fairies' (without frame)",
    price: 128,
    full_price: 160,
    image: "goods/item5.jpg",
    size: 'Size: 7.5 cm × 9.5 cm',
    material: 'Polymer clay',
  },
  {
    id: 6,
    name: "Brooch 'Secrets of Forest Fairies' (with frame)",
    price: 144,
    full_price: 180,
    image: "goods/item6.jpg",
    size: 'Size with wall frame: 12 cm × 9.5 cm. For wall mounting.',
    material: 'Polymer clay',
  },
  {
    id: 7,
    name: "'Witch's Harvest' brooch",
    price: 50,
    full_price: 60,
    image: "goods/item7.jpg",
    material: 'Polymer clay',
    size: 'Size: 4.5 cm × 4 cm',
  },
  {
    id: 8,
    name: "Earrings 'Her Potion'",
    price: 200,
    full_price: 200,
    image: "goods/item8.jpg",
    material: 'Polymer clay, stainless steel',
    size: 'Length: 7.5 cm with cauldron, 10.5 cm with hat (including dangles)',
  },
  {
    id: 9,
    name: "Poison Petals choker",
    price: 75,
    full_price: 100,
    image: "goods/item9.jpg",
    material: 'Polymer clay, stainless steel',
    size: 'Pendant size: 4 cm × 4.3 cm, chain length: 40 cm, adjustable up to 46 cm',
  },
  // {
  //   id: 10,
  //   name: "Dangerous Baby choker",
  //   price: 50,
  //   full_price: 50,
  //   image: "goods/item10.jpg",
  //   material: 'Polymer clay, stainless steel',
  //   size: 'Chain length: 39 cm, adjustable up to 43 cm, length can be extended upon request',
  // },
  // {
  //   id: 11,
  //   name: "Cript Glints choker",
  //   price: 43,
  //   full_price: 50,
  //   image: "goods/item11.jpg",
  //   material: 'Polymer clay, stainless steel',
  //   size: 'Dangling chain length: 7 cm. Main chain length: 38.5 cm, adjustable up to 43.5 cm',
  // },
  {
    id: 15,
    name: 'Brooch “Gloomy Flutter”',
    price: 70,
    image: 'goods/item15.jpg',
    material: 'Polymer clay, metal brooch base.',
    size: 'Width: 6.3 cm, height: 4.5 cm.'
  },
  {
    id: 16,
    name: 'Choker “Secret of the Enchanted Prince”',
    price: 60,
    image: 'goods/item16.jpg',
    material: 'Surgical steel, polymer clay, resin.',
    size: 'Chain length: 40.5 cm, adjustable up to 46 cm. Pendant size: Length 8.8 cm with the charm, 6.7 cm without the charm.',
  }
];

const categories = [
  {
    name: "custom-orders",
    title: "Custom items policy",
    image: "./images/cat-image1.jpg",
    description: "Dear friends, I am ready to work on your ideas and orders. Since I care about ensuring each of you has your own unique piece, I never create exact replicas. However, we can always craft something unique for you inspired by my previous works or bring your specific idea to life."
  },
  {
    name: "how-to-order",
    title: "How to make an custom order",
    image: "./images/cat-image2.jpg",
    description: [
      "1. Write to me directly on Instagram with your wishes or let me know which of my works you'd like me to base your piece on.",
      "2. We will discuss the details and design together.",
      "3. To reserve your spot in the queue for production, I usually request a 40% upfront payment. Payment can be made via PayPal.",
      "4. I will place you in the queue and let you know when I will begin your order and when it will be ready. Please be prepared to wait, as I put a lot of care and attention into each piece, and unfortunately, I cannot promise very quick turnaround times if the queue is long.",
      " 5. Once I have completed your order, I will send you photos of the finished piece. After that, you can transfer the remaining balance to my PayPal.",
      " 6. Delivery will be handled as described in the “Delivery” section."
    ].join('<br/>')
  },
  {
    name: "delivery",
    title: "Delivery",
    image: "./images/cat-image3.jpg",
    description: "Delivery is carried out by the international Spanish postal service Corerros. The approximate delivery amount will be communicated to you when placing the order, and the exact cost will be communicated to you after the shipment itself. I will send you a receipt for the shipment indicating the exact cost, which you can also pay via PayPal."
  },
];

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    instagram: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    ReactGA.event({
      category: "Ecommerce",
      action: "Add to Cart",
      label: product.name,
      value: product.price,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
    ReactGA.event({
      category: "Ecommerce",
      action: "Remove from Cart",
      label: `Removed ${productId} from cart`,
      value: 0,
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(currentCart => {
      return currentCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity < 1) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = item.price;
    return total + price * item.quantity;
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(false);

    const endpoint = import.meta.env.VITE_API_ENDPOINT || '';
    console.log(endpoint);

    fetch(`${endpoint}/api/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart,
        formData,
      }),
    })
    .then(response => {
      if (response.status) {
        toast.success('Order placed successfully!');
        setCart([]);
      } else {
        toast.error('There was an error processing your order. Please try again.');
      }
    })
    .catch(error => {
      toast.error('There was an error processing your order. Please try again.');
    });

    ReactGA.event({
      category: "Ecommerce",
      action: "Checkout",
      label: "User initiated checkout",
      value: cartTotal,
    });
  };

  if (isCheckingOut) {
    return (
      <div className="min-h-screen bg-black text-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button 
            onClick={() => setIsCheckingOut(false)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Checkout</h2>
              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                    <input
                      type="text"
                      name="instagram"
                      placeholder="Instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-4 mt-4">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                      <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-red-900 hover:bg-red-800 py-3 rounded-md transition-colors"
                >
                  Place Order
                </button>
              </form>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg h-fit">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-400">Quantity: {item.quantity}</p>
                      <p className="text-red-500">{item.price}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span>€ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t border-gray-800">
                    <span>Total</span>
                    <span>€ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <ToastContainer />
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Skull className="w-8 h-8" />
              <span className="text-xl font-gothic">Polymerclay Witchcraft</span>
            </div>
            
            {/* <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="hover:text-red-400 transition-colors">Collections</a>
              <a href="#" className="hover:text-red-400 transition-colors">New Arrivals</a>
              <a href="#" className="hover:text-red-400 transition-colors">Accessories</a>
              <a href="#" className="hover:text-red-400 transition-colors">Sale</a>
            </div> */}

            <div className="flex items-center space-x-4">
              {/* <button className="p-2 hover:bg-gray-800 rounded-full">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-full">
                <Heart className="w-5 h-5" />
              </button> */}
              <button 
                className="p-2 hover:bg-gray-800 rounded-full relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <button className="md:hidden p-2 hover:bg-gray-800 rounded-full">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-gray-900 z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Your cart is empty
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-gray-800 pb-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-red-500">{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-gray-800 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-gray-800 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>€ {cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckingOut(true);
                    }}
                    className="w-full bg-red-900 hover:bg-red-800 py-3 rounded-md transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Hero Section */}
      <div className="relative h-[200px] bg-center bg-cover" 
          //  style={{backgroundImage: "url('https://images.unsplash.com/photo-1604373679152-1c698ca9d9e4?auto=format&fit=crop&q=80')"}}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">My Showcase</h1>
              <p className="text-xl mb-8 text-gray-300">
                I create gothic jewellery inspired by dark fairy tales. Crafted with magic in every detail and atmosphere
              </p>
              {/* <button className="bg-red-900 hover:bg-red-800 px-8 py-3 text-lg transition-colors">
                Shop Now
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Items in stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-white text-black py-2 hover:bg-gray-200 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-lg">Material: {product.material}</p>
                <p className="text-sm">{product.size}</p>
                {product.full_price && product.full_price !== product.price && (
                  <div className="flex items-center justify-between">
                    <span className="line-through text-gray-400 mr-2">€ {product.full_price}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-red-500">€ {product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.name} className="relative group cursor-pointer">
              <div className="relative h-[700px] overflow-hidden">
              <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:hidden"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all">
                  <div className="h-full flex items-center justify-center">
                    <h3 className="text-2xl font-bold group-hover:hidden">{category.title}</h3>
                    <p className="text-lg text-gray-300 hidden group-hover:block" dangerouslySetInnerHTML={{ __html: category.description }}></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      {/* <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Dark Side</h2>
          <p className="mb-8 text-gray-400">Subscribe to our newsletter for exclusive offers and updates</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 bg-black border border-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
            <button className="px-6 py-2 bg-red-900 hover:bg-red-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      */}

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Me</h3>
              <p className="text-gray-400">Polymer Clay Witch since 2016.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://polymerclaywitchcraft.com/" className="hover:text-red-400">Main page</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400">Soon</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://www.instagram.com/polymerclay_witchcraft" className="hover:text-red-400">Instagram</a></li>
                <li><a href="https://www.facebook.com/share/fA76GzRWFfvrPgW3/" className="hover:text-red-400">Facebook</a></li>
                <li><a href="https://www.patreon.com/polymerclay_witchcraft" className="hover:text-red-400">Patreon</a></li>
                <li><a href="https://www.tiktok.com/@polymerclay_witchcraft" className="hover:text-red-400">TikTok</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; { new Date().getFullYear() } Jane / Polymerclay Witchcraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;