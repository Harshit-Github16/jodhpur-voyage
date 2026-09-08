/**
 * =========================================================================
 * JODHPUR VOYAGE - CENTRAL MOCK DATA REPOSITORY (Frontend Only)
 * =========================================================================
 * This single file holds all mock state for the frontend UI.
 * When you provide real backend APIs later, we will simply connect the
 * API client to your backend server without breaking any frontend components.
 * =========================================================================
 */

// 1. ADMIN USER
export const MOCK_ADMIN_USER = {
  id: 'usr-admin-01',
  name: 'Admin (user1)',
  email: 'user1@jodhpurvoyage.com',
  role: 'Super Admin',
  token: 'mock-jwt-token-jodhpur-voyage-valid',
};

// 2. CITIES & DESTINATIONS
export const MOCK_CITIES = [
  {
    id: 'city-jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    slug: 'jodhpur',
    tagline: 'The Legendary Sun City & Blue Heritage Capital',
    heroTitle: 'Discover Royal Jodhpur: Forts, Palaces & Desert Safaris',
    metaDescription: 'Explore the majestic Mehrangarh Fort, blue city walking trails, Umaid Bhawan palace, and authentic Thar desert camel safaris with Jodhpur Voyage.',
    bannerImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    ],
    highlights: ['Mehrangarh Fort', 'Toorji Ka Jhalra Stepwell', 'Osian Desert Dunes', 'Jaswant Thada Cenotaphs'],
    faqs: [
      { question: 'What is the best time to visit Jodhpur?', answer: 'The ideal time is from October to March when the winter weather is pleasant for sightseeing and desert safaris.' },
      { question: 'Why is Jodhpur called the Blue City?', answer: 'The old quarters around Mehrangarh Fort are traditionally painted in indigo-blue to keep houses cool and distinguish Brahmin residences.' },
      { question: 'How many days are recommended for Jodhpur?', answer: 'A 2 to 3-day itinerary is recommended to explore major forts, blue city walking trails, and an overnight desert safari in Osian.' }
    ],
    packagesCount: 6,
    status: 'Published',
    featured: true,
    createdAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'city-jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    slug: 'jaipur',
    tagline: 'The Pink City of Royal Fortresses & Bazaars',
    heroTitle: 'Experience Jaipur: Amber Fort, Hawa Mahal & Royal Heritage',
    metaDescription: 'Immerse yourself in Rajasthan’s capital with Amber Fort elephant trails, City Palace tours, and vibrant gem bazaars.',
    bannerImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    ],
    highlights: ['Amber Fort & Sheesh Mahal', 'Hawa Mahal Palace of Winds', 'Jantar Mantar Observatory', 'Johari Bazaar'],
    faqs: [
      { question: 'What are the top attractions in Jaipur?', answer: 'Amber Fort, Hawa Mahal, City Palace, Nahargarh Fort sunset view, and Jal Mahal.' }
    ],
    packagesCount: 4,
    status: 'Published',
    featured: true,
    createdAt: '2025-01-05T12:00:00Z',
  },
  {
    id: 'city-udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    slug: 'udaipur',
    tagline: 'City of Lakes & Romantic Palaces',
    heroTitle: 'Explore Udaipur: Lake Pichola Boat Cruises & Royal Splendor',
    metaDescription: 'Experience serene boat rides on Lake Pichola, Grand City Palace, and Jag Mandir island retreats.',
    bannerImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    ],
    highlights: ['Lake Pichola Boat Cruise', 'City Palace Complex', 'Saheliyon Ki Bari', 'Monsoon Palace (Sajjangarh)'],
    faqs: [
      { question: 'Is a boat ride included in Udaipur tours?', answer: 'Yes, all standard packages include a sunset boat ride on Lake Pichola around Lake Palace.' }
    ],
    packagesCount: 3,
    status: 'Published',
    featured: false,
    createdAt: '2025-01-10T14:00:00Z',
  },
  {
    id: 'city-jaisalmer',
    name: 'Jaisalmer',
    state: 'Rajasthan',
    slug: 'jaisalmer',
    tagline: 'The Golden City & Sam Sand Dunes Haven',
    heroTitle: 'Adventure in Jaisalmer: Living Golden Fort & Starlit Desert Camps',
    metaDescription: 'Camp under the stars in the Thar desert, explore Jaisalmer Fort, and ride camels over golden sand dunes.',
    bannerImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    highlights: ['Jaisalmer Golden Fort', 'Sam Sand Dunes Luxury Camp', 'Patwon Ki Haveli', 'Gadisar Lake'],
    faqs: [
      { question: 'Are desert tents AC or luxury?', answer: 'We offer Swiss luxury Swiss tents with attached modern bathrooms and cultural folk shows.' }
    ],
    packagesCount: 2,
    status: 'Draft',
    featured: false,
    createdAt: '2025-01-15T09:00:00Z',
  },
];

// 3. PACKAGES / TOURS
export const MOCK_PACKAGES = [
  {
    id: 'pkg-101',
    cityId: 'city-jodhpur',
    cityName: 'Jodhpur',
    title: 'Mehrangarh Fort & Jaswant Thada Heritage Walk',
    category: 'Heritage & History',
    duration: '4 Hours',
    price: 1499,
    originalPrice: 1999,
    maxGroupSize: 15,
    rating: 4.9,
    reviewsCount: 184,
    status: 'Active',
    featured: true,
    location: 'Fort Road, Jodhpur',
    description: 'Explore the majestic 15th-century Mehrangarh Fort with private audio guides, museum exhibits, and white marble cenotaph of Jaswant Thada.',
    inclusions: ['Fort Entry Ticket', 'Licensed Guide', 'Mineral Water', 'Jaswant Thada Entry'],
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pkg-102',
    cityId: 'city-jodhpur',
    cityName: 'Jodhpur',
    title: 'Blue City Alleys & Stepwell Sunset Photography Walk',
    category: 'Walking Tours',
    duration: '3 Hours',
    price: 899,
    originalPrice: 1200,
    maxGroupSize: 10,
    rating: 4.8,
    reviewsCount: 126,
    status: 'Active',
    featured: true,
    location: 'Navchokiya & Toorji Ka Jhalra',
    description: 'Immerse in the indigo Brahmin quarters of Navchokiya, taste royal masala chai, and photograph Toorji Ka Jhalra stepwell at sunset.',
    inclusions: ['Local Guide', 'Chai & Snacks', 'Photo guidance'],
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pkg-103',
    cityId: 'city-jodhpur',
    cityName: 'Jodhpur',
    title: 'Osian Desert Dunes Sunset Camel Safari & Folk Dinner',
    category: 'Desert Safari',
    duration: '7 Hours',
    price: 3499,
    originalPrice: 4200,
    maxGroupSize: 20,
    rating: 4.95,
    reviewsCount: 210,
    status: 'Active',
    featured: true,
    location: 'Osian Dunes',
    description: '8th-century temple visits, 4x4 dune bashing, camel safari at sunset, and Rajasthani Kalbeliya folk dance around bonfire with dinner.',
    inclusions: ['AC Transport', 'Camel Safari', 'Buffet Dinner', 'Cultural Folk Show'],
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pkg-104',
    cityId: 'city-jaipur',
    cityName: 'Jaipur',
    title: 'Amber Fort Royal Heritage & Sheesh Mahal Tour',
    category: 'Heritage & History',
    duration: '5 Hours',
    price: 1899,
    originalPrice: 2400,
    maxGroupSize: 15,
    rating: 4.85,
    reviewsCount: 142,
    status: 'Active',
    featured: true,
    location: 'Amer, Jaipur',
    description: 'Grand Amer fort exploration, Mirror Palace (Sheesh Mahal), Panna Meena Ka Kund stepwell, and royal elephant court visit.',
    inclusions: ['Amer Fort Tickets', 'Historian Guide', 'AC Cab from Hotel'],
    image: 'https://images.unsplash.com/photo-1603289984181-98754b281b3a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pkg-105',
    cityId: 'city-udaipur',
    cityName: 'Udaipur',
    title: 'Lake Pichola Sunset Luxury Cruise & Jag Mandir Island',
    category: 'Luxury & Royal',
    duration: '3 Hours',
    price: 2499,
    originalPrice: 3200,
    maxGroupSize: 12,
    rating: 4.92,
    reviewsCount: 98,
    status: 'Active',
    featured: true,
    location: 'Lake Pichola, Udaipur',
    description: 'Private chartered boat cruise on Lake Pichola, panoramic views of City Palace, Jag Mandir island palace, and royal high tea.',
    inclusions: ['Boat Cruise Ticket', 'Jag Mandir Entry', 'High Tea & Snacks'],
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
  },
];

// 4. BLOG ARTICLES
export const MOCK_BLOGS = [
  {
    id: 'blog-101',
    title: 'Top 7 Hidden Blue City Alleys Every Photographer Must Visit in Jodhpur',
    slug: 'hidden-blue-city-alleys-jodhpur-photography',
    category: 'Travel Guide',
    excerpt: 'Step off the beaten path into the historic Navchokiya quarter to discover secret rooftops, indigo doorways, and stunning stepwell perspectives.',
    content: `Jodhpur’s old city, affectionately known as the Blue City, is a labyrinth of winding medieval lanes where every turn reveals a burst of azure blue architecture, ancient carved jharokhas, and smiling locals sipping masala chai.

### 1. Navchokiya Brahmin Quarter
The most intensely blue painted homes reside here. Stroll through early in the morning around 7:00 AM for the softest natural light without crowd interference.

### 2. Toorji Ka Jhalra Stepwell
Built in the 1740s by Queen Consort of Maharaja Abhay Singh, this 200-foot deep pyramid stepwell is one of Rajasthan's finest architectural gems.

### 3. Pachetia Hill Viewpoint
Climb the stone stairs behind the old quarters for an unparalleled 360-degree panorama of the blue town beneath the towering cliffs of Mehrangarh Fort.`,
    author: 'Harshit Panigrahi',
    authorRole: 'Chief Travel Curator',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    readTime: '5 min read',
    tags: ['Photography', 'Blue City', 'Heritage', 'Walks'],
    views: 1420,
    status: 'Published',
    featured: true,
    publishedAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'blog-102',
    title: 'The Ultimate Guide to Osian Desert Safari: Dune Bashing, Camels & Starlit Dinners',
    slug: 'ultimate-guide-osian-desert-safari-jodhpur',
    category: 'Desert Expeditions',
    excerpt: 'Located just 60km from Jodhpur, Osian offers the tranquility of the Thar Desert with ancient 8th-century stone temples and luxury desert glamping.',
    content: `If you want a genuine desert experience without traveling all the way to Jaisalmer, Osian is Jodhpur’s best kept secret.

### Why Choose Osian over Sam Dunes?
Osian offers a far more pristine, peaceful desert environment with undisturbed sand dunes, breathtaking sunset vistas, and rich 8th-century temple architecture.

### What to Expect on our Safari
- 4x4 Off-road Dune Bashing with licensed stunt drivers
- Sunset Camel Trekking across golden sand ridges
- Kalbeliya Folk Dance, fire dancers, and authentic Rajasthani Dal Baati Churma dinner around a bonfire.`,
    author: 'Vikramaditya Rathore',
    authorRole: 'Desert Expedition Leader',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
    readTime: '6 min read',
    tags: ['Desert Safari', 'Osian', 'Adventure', 'Culture'],
    views: 980,
    status: 'Published',
    featured: true,
    publishedAt: '2026-09-05T14:30:00Z',
  },
  {
    id: 'blog-103',
    title: 'A Culinary Journey Through Sardar Market: Jodhpuri Mirchi Vada, Pyaaz Kachori & Lassi',
    slug: 'culinary-journey-jodhpur-street-food-guide',
    category: 'Food & Culture',
    excerpt: 'Taste your way through century-old sweet shops and spicy culinary landmarks around the iconic Clock Tower of Jodhpur.',
    content: `No trip to Jodhpur is complete without indulging in the spicy, crispy, and sweet delicacies that define Marwari street cuisine.

### 1. Shahi Samosa & Pyaaz Kachori
Located right near the Clock Tower entrance, their freshly fried onion kachoris are spiced to royal perfection.

### 2. Shri Mishrilal Hotel Makhaniya Lassi
Operating since 1927, this world-famous establishment serves thick, cardamom-infused saffron lassi topped with pure clotted cream (makhan).

### 3. Janta Sweet Home Mawa Kachori
A dessert unique to Jodhpur, crisp puffed pastries stuffed with sweetened mawa, dry fruits, and dipped in fragrant sugar syrup.`,
    author: 'Pooja Choudhary',
    authorRole: 'Culinary Historian',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    readTime: '4 min read',
    tags: ['Street Food', 'Culinary', 'Clock Tower', 'Sweets'],
    views: 750,
    status: 'Published',
    featured: false,
    publishedAt: '2026-09-07T09:15:00Z',
  },
];

// 5. CUSTOMERS
export const MOCK_CUSTOMERS = [
  {
    id: 'cust-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98290 12345',
    city: 'Mumbai, India',
    totalBookings: 3,
    totalSpent: 8496,
    lastActive: '2026-09-08',
    status: 'Active',
    badge: 'VIP Traveler',
  },
  {
    id: 'cust-102',
    name: 'Elena Rostova',
    email: 'elena.rostova@traveler.com',
    phone: '+44 7700 900123',
    city: 'London, UK',
    totalBookings: 2,
    totalSpent: 27992,
    lastActive: '2026-09-07',
    status: 'Active',
    badge: 'International Guest',
  },
  {
    id: 'cust-103',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@gmail.com',
    phone: '+91 94141 55667',
    city: 'Ahmedabad, India',
    totalBookings: 1,
    totalSpent: 899,
    lastActive: '2026-09-07',
    status: 'Active',
    badge: 'New Guest',
  },
  {
    id: 'cust-104',
    name: 'Sophie & Liam Becker',
    email: 'sophie.becker@outlook.de',
    phone: '+49 151 2345678',
    city: 'Munich, Germany',
    totalBookings: 2,
    totalSpent: 8796,
    lastActive: '2026-09-08',
    status: 'Active',
    badge: 'VIP Traveler',
  },
  {
    id: 'cust-105',
    name: 'Vikramaditya Rathore',
    email: 'vikram.rathore@rajasthan.in',
    phone: '+91 98280 99887',
    city: 'Jaipur, India',
    totalBookings: 4,
    totalSpent: 16588,
    lastActive: '2026-09-08',
    status: 'Active',
    badge: 'Loyal Patron',
  },
  {
    id: 'cust-106',
    name: 'Maya Patel',
    email: 'maya.patel@techcorp.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru, India',
    totalBookings: 1,
    totalSpent: 1598,
    lastActive: '2026-09-05',
    status: 'Inactive',
    badge: 'Standard',
  },
];

// 6. ORDERS & RESERVATIONS
export const MOCK_ORDERS = [
  {
    id: 'ORD-2026-901',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98290 12345',
    cityName: 'Jodhpur',
    packageTitle: 'Mehrangarh Fort & Jaswant Thada Heritage Walk',
    tourTitle: 'Mehrangarh Fort & Jaswant Thada Heritage Walk',
    travelers: 2,
    tourDate: '2026-09-12',
    totalAmount: 2998,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI (Razorpay)',
    orderStatus: 'Confirmed',
    status: 'Confirmed',
    createdAt: '2026-09-06T11:20:00Z',
  },
  {
    id: 'ORD-2026-902',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@traveler.com',
    customerPhone: '+44 7700 900123',
    cityName: 'Jodhpur',
    packageTitle: 'Osian Desert Dunes Sunset Camel Safari & Folk Dinner',
    tourTitle: 'Osian Desert Dunes Sunset Camel Safari & Folk Dinner',
    travelers: 4,
    tourDate: '2026-09-15',
    totalAmount: 13996,
    paymentStatus: 'Paid',
    paymentMethod: 'Stripe (Card)',
    orderStatus: 'In-Progress',
    status: 'Confirmed',
    createdAt: '2026-09-07T08:15:00Z',
  },
  {
    id: 'ORD-2026-903',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@gmail.com',
    customerPhone: '+91 94141 55667',
    cityName: 'Jodhpur',
    packageTitle: 'Blue City Alleys & Stepwell Sunset Photography Walk',
    tourTitle: 'Blue City Alleys & Stepwell Sunset Photography Walk',
    travelers: 1,
    tourDate: '2026-09-10',
    totalAmount: 899,
    paymentStatus: 'Pending',
    paymentMethod: 'Pay on Arrival',
    orderStatus: 'Pending',
    status: 'Pending',
    createdAt: '2026-09-07T16:45:00Z',
  },
  {
    id: 'ORD-2026-904',
    customerName: 'Sophie & Liam Becker',
    customerEmail: 'sophie.becker@outlook.de',
    customerPhone: '+49 151 2345678',
    cityName: 'Jaipur',
    packageTitle: 'Amber Fort Royal Heritage & Sheesh Mahal Tour',
    tourTitle: 'Amber Fort Royal Heritage & Sheesh Mahal Tour',
    travelers: 2,
    tourDate: '2026-09-18',
    totalAmount: 3798,
    paymentStatus: 'Paid',
    paymentMethod: 'PayPal',
    orderStatus: 'Confirmed',
    status: 'Confirmed',
    createdAt: '2026-09-08T06:30:00Z',
  },
  {
    id: 'ORD-2026-905',
    customerName: 'Vikramaditya Rathore',
    customerEmail: 'vikram.rathore@rajasthan.in',
    customerPhone: '+91 98280 99887',
    cityName: 'Udaipur',
    packageTitle: 'Lake Pichola Sunset Luxury Cruise & Jag Mandir Island',
    tourTitle: 'Lake Pichola Sunset Luxury Cruise & Jag Mandir Island',
    travelers: 3,
    tourDate: '2026-09-14',
    totalAmount: 7497,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    orderStatus: 'Confirmed',
    status: 'Confirmed',
    createdAt: '2026-09-08T09:10:00Z',
  },
];

// Compatibility aliases
export const INITIAL_CITIES = MOCK_CITIES;
export const INITIAL_PACKAGES = MOCK_PACKAGES;
export const INITIAL_TOURS = MOCK_PACKAGES;
export const INITIAL_BLOGS = MOCK_BLOGS;
export const INITIAL_CUSTOMERS = MOCK_CUSTOMERS;
export const INITIAL_ORDERS = MOCK_ORDERS;
export const INITIAL_BOOKINGS = MOCK_ORDERS;
