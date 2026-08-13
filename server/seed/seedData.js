const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('../models/Destination');

dotenv.config({ path: __dirname + '/../.env' });

const destinations = [
  {
    name: 'Goa',
    location: 'Goa, West Coast',
    country: 'India',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Famous for its pristine sun-kissed golden beaches, vibrant nightlife, Portuguese colonial architecture, and fresh coastal seafood. Goa offers the perfect blend of relaxation and high-energy water adventure sports.',
    bestTime: 'November to February',
    budget: '₹3,500 - ₹9,000 / day',
    attractions: [
      'Baga Beach & Calangute',
      'Aguada Fort & Lighthouse',
      'Basilica of Bom Jesus',
      'Dudhsagar Waterfalls',
      'Anjuna Flea Market',
    ],
    food: [
      'Goan Fish Curry & Rice',
      'Pork Vindaloo',
      'Bebinca Dessert',
      'Prawn Balchão',
      'Feni Cocktail',
    ],
    travelTips: [
      'Rent a two-wheeler for convenient beach hopping.',
      'Explore South Goa for peaceful secluded beaches and North Goa for nightlife.',
      'Respect local dress codes when visiting historic churches and cathedrals.',
    ],
    rating: 4.9,
    isPopular: true,
  },
  {
    name: 'Manali',
    location: 'Himachal Pradesh',
    country: 'India',
    category: 'Mountain',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'A breathtaking high-altitude Himalayan resort town nestled on the Beas River. Celebrated for snow-capped mountain vistas, apple orchards, Solang Valley adventure sports, and scenic Rohtang Pass.',
    bestTime: 'October to June',
    budget: '₹2,500 - ₹7,000 / day',
    attractions: [
      'Solang Valley & Paragliding',
      'Rohtang Pass Snow Point',
      'Hidimba Devi Wooden Temple',
      'Old Manali Cafes & Boutiques',
      'Jogini Waterfall Trek',
    ],
    food: [
      'Siddu with Ghee',
      'Kullu Trout Fish',
      'Tudkiya Bhat',
      'Tibetan Thukpa & Momos',
      'Fresh Himalayan Apple Cider',
    ],
    travelTips: [
      'Book Rohtang Pass green permits well in advance online.',
      'Carry layered thermal clothing even during autumn.',
      'Hire an experienced mountain driver for snowy altitudes.',
    ],
    rating: 4.8,
    isPopular: true,
  },
  {
    name: 'Jaipur',
    location: 'Rajasthan',
    country: 'India',
    category: 'Historical',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'The iconic "Pink City", capital of Rajasthan. Famous for magnificent Rajput hilltop forts, ornate royal palaces, intricate pink sandstone facades, and vibrant bazaars loaded with handicrafts and jewelry.',
    bestTime: 'October to March',
    budget: '₹3,000 - ₹8,500 / day',
    attractions: [
      'Amber Fort & Sheesh Mahal',
      'Hawa Mahal (Palace of Winds)',
      'City Palace & Museum',
      'Jantar Mantar Astronomical Observatory',
      'Nahargarh Fort Sunset Point',
    ],
    food: [
      'Dal Baati Churma with Pure Ghee',
      'Laal Maas Spicy Mutton',
      'Pyaaz Kachori with Mint Chutney',
      'Ghevar Traditional Sweet',
      'Masala Chai at Gulab Ji',
    ],
    travelTips: [
      'Buy a composite heritage ticket for major monuments to skip queues.',
      'Visit Hawa Mahal early in the morning for gorgeous sunrise photos.',
      'Bargain politely in Johari Bazaar and Bapu Bazaar.',
    ],
    rating: 4.9,
    isPopular: true,
  },
  {
    name: 'Varanasi',
    location: 'Uttar Pradesh',
    country: 'India',
    category: 'Religious',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'One of the oldest continuously inhabited cities in human history. The spiritual heart of India on the sacred banks of the Ganges, famous for ancient ghats, soul-stirring evening Ganga Aarti rituals, and narrow labyrinthine alleys.',
    bestTime: 'November to February',
    budget: '₹1,800 - ₹5,000 / day',
    attractions: [
      'Dashashwamedh Ghat Evening Aarti',
      'Kashi Vishwanath Jyotirlinga Temple',
      'Early Morning Boat Ride on Holy Ganges',
      'Assi Ghat & Subah-e-Banaras',
      'Sarnath Buddhist Monuments',
    ],
    food: [
      'Banarasi Malaiyo Winter Sweet',
      'Kachori Sabzi & Jalebi',
      'Famous Banarasi Paan',
      'Tamatar Chaat at Kashi Chaat Bhandar',
      'Thick Lassi in Earthen Kulhad',
    ],
    travelTips: [
      'Take a dawn hand-rowed boat ride for tranquil spiritual vistas.',
      'Dress modestly and respect holy customs and ceremonies.',
      'Explore hidden courtyards on foot with a local storyteller guide.',
    ],
    rating: 4.8,
    isPopular: true,
  },
  {
    name: 'Delhi',
    location: 'National Capital Region',
    country: 'India',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'The monumental capital of India uniting Mughal grandeur with modern cosmopolitan energy. Home to UNESCO World Heritage monuments, bustling spice markets of Chandni Chowk, and world-class culinary streets.',
    bestTime: 'October to March',
    budget: '₹2,500 - ₹8,000 / day',
    attractions: [
      'Humayun’s Tomb Gardens',
      'Qutub Minar Complex',
      'Red Fort & Chandni Chowk',
      'India Gate & Kartavya Path',
      'Lotus Temple & Akshardham',
    ],
    food: [
      'Authentic Butter Chicken at Pandara Road',
      'Chole Bhature with Pickled Green Chillies',
      'Parathas at Gali Paranthe Wali',
      'Dahi Bhalla at Natraj',
      'Old Delhi Kulfi Falooda',
    ],
    travelTips: [
      'The Delhi Metro is super fast, safe, air-conditioned, and affordable.',
      'Check monument timings—many museums close on Mondays.',
      'Opt for walking street-food tours with a certified local guide.',
    ],
    rating: 4.7,
    isPopular: true,
  },
  {
    name: 'Mumbai',
    location: 'Maharashtra',
    country: 'India',
    category: 'City',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'The glamorous "City of Dreams", India’s financial and entertainment powerhouse. Features the iconic Gateway of India, majestic British Victorian Gothic architecture, vibrant Marine Drive sunsets, and Bollywood.',
    bestTime: 'November to February',
    budget: '₹3,500 - ₹12,000 / day',
    attractions: [
      'Gateway of India & Elephanta Caves',
      'Marine Drive "Queen’s Necklace"',
      'Chhatrapati Shivaji Maharaj Terminus',
      'Bandra Bandstand & Sea Link',
      'Colaba Causeway Shopping Street',
    ],
    food: [
      'Vada Pav from Ashok Vada Pav',
      'Pav Bhaji at Sardar Refreshments',
      'Bombay Duck Fry & Bombil Curry',
      'Parsi Berry Pulao at Britannia & Co.',
      'Kulfi at Chowpatty Beach',
    ],
    travelTips: [
      'Take a sunset taxi drive across the Bandra-Worli Sea Link.',
      'Try the local train experience during non-peak afternoon hours.',
      'Catch art gallery exhibitions around Kala Ghoda precinct.',
    ],
    rating: 4.8,
    isPopular: true,
  },
  {
    name: 'Rishikesh',
    location: 'Uttarakhand',
    country: 'India',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1603813591448-4395b28d08cb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603813591448-4395b28d08cb?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'The Yoga Capital of the World and adventure playground in the Himalayan foothills. Renowned for white-water river rafting on the emerald Ganges, cliff jumping, peaceful ashrams, and the historic Beatles Ashram.',
    bestTime: 'September to November & March to May',
    budget: '₹2,000 - ₹6,000 / day',
    attractions: [
      'Ganges White Water Rafting Rapids',
      'Triveni Ghat Evening Maha Aarti',
      'Beatles Ashram (Chaurasi Kutia)',
      'Laxman Jhula & Ram Jhula Bridges',
      'Neer Garh Waterfall Trek',
    ],
    food: [
      'Ayurvedic Organic Thalis',
      'Fresh Fruit Bowls & Smoothie Bowls',
      'Aloo Puri at Chotiwala',
      'Wood-fired Artisan Pizzas',
      'Ginger Lemon Honey Tea',
    ],
    travelTips: [
      'Rishikesh is a strictly vegetarian and alcohol-free holy sanctuary.',
      'Book certified grade 3/4 river rafting operators.',
      'Participate in early morning yoga and meditation at river ashrams.',
    ],
    rating: 4.9,
    isPopular: false,
  },
  {
    name: 'Udaipur',
    location: 'Rajasthan',
    country: 'India',
    category: 'Historical',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'The romantic "City of Lakes" and Venice of the East. Surrounded by the azure waters of Lake Pichola and the Aravalli hills, boasting lavish marble palaces, serene rooftop dining, and royal heritage.',
    bestTime: 'October to March',
    budget: '₹3,200 - ₹9,500 / day',
    attractions: [
      'Udaipur City Palace on Lake Pichola',
      'Lake Palace & Jag Mandir Island',
      'Saheliyon-ki-Bari Royal Gardens',
      'Bagore Ki Haveli Folk Dance Show',
      'Monsoon Palace (Sajjangarh) Sunset',
    ],
    food: [
      'Rajasthani Royal Thali',
      'Gatte Ki Sabzi',
      'Ker Sangri Desert Beans',
      'Mirchi Vada with Tamarind Chutney',
      'Mawa准Kachori Sweet',
    ],
    travelTips: [
      'Book a sunset boat cruise on Lake Pichola.',
      'Reserve a lakeside rooftop candlelit dinner in advance.',
      'Visit Bagore Ki Haveli in the evening for traditional Dharohar dance.',
    ],
    rating: 4.9,
    isPopular: false,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelguide?directConnection=true';
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB at', mongoUri);

    // Only seed popular destinations - NO dummy guides or fake users
    await Destination.deleteMany();
    const createdDestinations = await Destination.create(destinations);
    console.log(`[Seed]: Seeded ${createdDestinations.length} popular travel destinations.`);
    console.log('[Seed]: NO dummy guides seeded. Guide list remains strictly database-driven via real user registration.');

    console.log('==============================================');
    console.log('✅ DESTINATIONS SEEDED SUCCESSFULLY!');
    console.log('==============================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
