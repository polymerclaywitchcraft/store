import React, { useState } from 'react';
import { Skull, ShoppingCart, Search, Menu, Heart, Clock, Truck, Shield, Star, X, Plus, Minus, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

const products = [
  {
    id: 1,
    name: "Gothic Victorian Dress",
    price: "$299.99",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: 2,
    name: "Black Velvet Coat",
    price: "$199.99",
    image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: 3,
    name: "Silver Gothic Jewelry",
    price: "$89.99",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: 4,
    name: "Leather Platform Boots",
    price: "$159.99",
    image: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&q=80&w=500",
  }
];

const categories = [
  {
    name: "Victorian Era",
    title: "Кастомные заказы",
    image: "https://images.unsplash.com/photo-1518997613208-3a8c04ad1324?auto=format&fit=crop&q=80&w=500",
    description: "Дорогие друзья, я готова поработать над вашими идеями и заказами. Так как я забочусь о том, чтобы у каждого из вас было свое уникальное изделие, я никогда не делаю точных повторов. Но мы всегда может сделать что-то уникальное для вас по мотивам моих прошлых работ или же воплотить именно вашу идею."
  },
  {
    name: "Modern Gothic",
    title: "Как заказать",
    image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=500",
    description: "1. Напишите мне в директ в инстаграм свою свои пожелания или по мотивам какой моей работы вы хотели бы чтобы я создала изделие " + 
 "2. Мы обговариваем с вами детали и дизайн " +
 "3. Чтобы я могла поставить вам в очередь на изготовление, я обычно беру предоплат 40%. Оплатить можно будет через пэй пал" +
 "4. Я ставлю вас в очередь и говорю через сколько приступлю к заказу и когда он будет готов. Будьте готовы, что нужно будет подождать, так как я очень тщательно работаю над изделиями и к сожалению не могу обещать вам очень быстрых сроков если очередь длинная." +
 "5. Как только я изготавливаю заказ полностью и высылаю вам фото, вы переводите остаток суммы оплаты на мой пэйпал" +
 "6. Далее осуществляется доставка как описано в разделе доставка"
  },
  {
    name: "Steampunk",
    title: "Доставка",
    image: "https://images.unsplash.com/photo-1576793048000-494aaa93d160?auto=format&fit=crop&q=80&w=500",
    description: " Доставка осуществляется местной испанской почтовой службой Corerros. Примерная сумма доставки сообщится вам при оформлении заказа, точная стоимость сообщится вам после самой отправки. Я вышлю вам квитанцию об отправлении на которой будет указана точная стоимость, которую вы также сможете оплатить на пэйпал."
  },
];

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
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
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
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
    const price = parseFloat(item.price.replace('$', ''));
    return total + price * item.quantity;
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle payment processing and order submission
    alert('Order placed successfully!');
    setCart([]);
    setIsCheckingOut(false);

    fetch('/api/order', {
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
        if (!response.ok) {
          toast.error('There was an error processing your order. Please try again.');
          throw new Error('Network response was not ok');
        }
        toast.success('Order placed successfully!');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        alert('Order placed successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error processing your order. Please try again.');
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
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                      <input
                        type="text"
                        name="cardCvc"
                        placeholder="CVC"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
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
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg mt-2">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t border-gray-800">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
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

            {/* <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-800 rounded-full">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-full">
                <Heart className="w-5 h-5" />
              </button>
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
            </div> */}
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
                    <span>${cartTotal.toFixed(2)}</span>
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
           style={{backgroundImage: "url('https://images.unsplash.com/photo-1604373679152-1c698ca9d9e4?auto=format&fit=crop&q=80')"}}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Кастомные заказы</h1>
              <p className="text-xl mb-8 text-gray-300">
                Дорогие друзья, я готова поработать над вашими идеями и заказами. 
                Так как я забочусь о том, чтобы у каждого из вас было свое уникальное изделие, я никогда не делаю точных повторов.
                Но мы всегда может сделать что-то уникальное для вас по мотивам моих прошлых работ или же воплотить именно вашу идею.
              </p>
              {/* <button className="bg-red-900 hover:bg-red-800 px-8 py-3 text-lg transition-colors">
                Shop Now
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Если вы уверены, что хотите сделать кастомный заказ:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.name} className="relative group cursor-pointer">
              <div className="relative h-[300px] overflow-hidden">
              <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:hidden"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all">
                  <div className="h-full flex items-center justify-center">
                    <h3 className="text-2xl font-bold group-hover:hidden">{category.title}</h3>
                    <p className="text-lg text-gray-300 hidden group-hover:block">{category.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <Truck className="w-10 h-10 text-red-500" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-gray-400">On orders over $200</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="w-10 h-10 text-red-500" />
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-gray-400">Get help anytime</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="w-10 h-10 text-red-500" />
              <div>
                <h3 className="font-semibold">Secure Payments</h3>
                <p className="text-gray-400">100% protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Items</h2>
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
                <div className="flex items-center justify-between">
                  <p className="text-red-500">{product.price}</p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-red-500 fill-current" />
                    <Star className="w-4 h-4 text-red-500 fill-current" />
                    <Star className="w-4 h-4 text-red-500 fill-current" />
                    <Star className="w-4 h-4 text-red-500 fill-current" />
                    <Star className="w-4 h-4 text-gray-600" />
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
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-400">Crafting darkness into elegance since 2020. Your premier destination for gothic fashion and accessories.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400">FAQ</a></li>
                <li><a href="#" className="hover:text-red-400">Shipping Info</a></li>
                <li><a href="#" className="hover:text-red-400">Returns</a></li>
                <li><a href="#" className="hover:text-red-400">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400">Dresses</a></li>
                <li><a href="#" className="hover:text-red-400">Accessories</a></li>
                <li><a href="#" className="hover:text-red-400">Footwear</a></li>
                <li><a href="#" className="hover:text-red-400">Jewelry</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400">Instagram</a></li>
                <li><a href="#" className="hover:text-red-400">Facebook</a></li>
                <li><a href="#" className="hover:text-red-400">Twitter</a></li>
                <li><a href="#" className="hover:text-red-400">Pinterest</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Polymerclay Witchcraft Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;