export interface CarSpecDetails {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuelType: string;
  mileage: string;
  safetyRating: string;
  seating: string;
  bootSpace: string;
  groundClearance: string;
  colors: { name: string; hex: string }[];
  keyFeatures: string[];
}

export interface AccessoryOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const COMMON_ACCESSORIES: AccessoryOption[] = [
  {
    id: 'warranty',
    name: '5-Year Extended Warranty & RSA',
    price: 24999,
    description: 'Bumper-to-bumper coverage up to 1,50,000 km with 24/7 Pan-India Roadside Assistance',
  },
  {
    id: 'ceramic',
    name: '3M 9H Ceramic Paint Protection Coating',
    price: 14500,
    description: 'Multi-layer hydrophobic gloss shielding with 3-year warranty against scratches and UV fade',
  },
  {
    id: 'mats',
    name: '7D All-Weather Floor Mats & Boot Liner',
    price: 6800,
    description: 'Custom laser-cut waterproof leatherette mats with anti-skid backing',
  },
  {
    id: 'dashcam',
    name: '4K Ultra HD Dual Dashcam (Front + Rear)',
    price: 9999,
    description: 'Night vision Sony Starvis sensor with 24-hour parking surveillance and app sync',
  },
];

const CAR_SPECS_DATA: Record<string, Partial<CarSpecDetails>> = {
  'Thar 4x4': {
    engine: '2.0L mStallion 150 TGDi Turbo Petrol / 2.2L mHawk Diesel',
    power: '150 bhp @ 5000 rpm',
    torque: '320 Nm @ 1500-3000 rpm',
    transmission: '6-Speed Manual / 6-Speed Torque Converter Automatic',
    fuelType: 'Petrol / Diesel',
    mileage: '15.2 km/l ARAI',
    safetyRating: '⭐⭐⭐⭐ (4-Star Global NCAP)',
    seating: '4 Seater Front-Facing',
    bootSpace: '385 Litres (Seats Folded)',
    groundClearance: '226 mm',
    colors: [
      { name: 'Red Rage', hex: '#b91c1c' },
      { name: 'Napoli Black', hex: '#18181b' },
      { name: 'Aquamarine', hex: '#0e7490' },
      { name: 'Galaxy Grey', hex: '#52525b' },
      { name: 'Everest White', hex: '#f4f4f5' },
    ],
    keyFeatures: [
      'Shift-on-the-fly 4x4 Transfer Case with Low Ratio',
      'Mechanical Locking Rear Differential (MLD)',
      'Washable Interior with Drain Plugs & IP54 Controls',
      'Roll Cage & Removable Roof Configuration',
    ],
  },
  'Nexon EV': {
    engine: 'Permanent Magnet Synchronous AC Motor (Gen-2)',
    power: '143 bhp (106 kW)',
    torque: '215 Nm Instantaneous',
    transmission: 'Single Speed Automatic e-Drive',
    fuelType: 'Electric (40.5 kWh High Energy LFP)',
    mileage: '465 km Range (ARAI Certified)',
    safetyRating: '⭐⭐⭐⭐⭐ (5-Star Bharat NCAP)',
    seating: '5 Seater Luxury SUV',
    bootSpace: '350 Litres',
    groundClearance: '205 mm',
    colors: [
      { name: 'Empowered Oxide', hex: '#38bdf8' },
      { name: 'Daytona Grey', hex: '#4b5563' },
      { name: 'Pristine White', hex: '#f8fafc' },
      { name: 'Flame Red', hex: '#dc2626' },
    ],
    keyFeatures: [
      'V2V (Vehicle to Vehicle) & V2L (Vehicle to Load) Power Transfer',
      '12.3-inch Cinematic HD Touchscreen by Harman',
      'Multi-Mode Regenerative Braking with Paddle Shifters',
      'DC Fast Charging: 10% to 80% in 56 mins',
    ],
  },
  'XUV700 AX7': {
    engine: '2.2L mHawk Turbocharged Common Rail Diesel',
    power: '185 bhp @ 3500 rpm',
    torque: '450 Nm @ 1750-2800 rpm',
    transmission: '6-Speed AISIN Automatic with Manual Mode',
    fuelType: 'Diesel',
    mileage: '16.6 km/l ARAI',
    safetyRating: '⭐⭐⭐⭐⭐ (5-Star Global NCAP + Safer Choice)',
    seating: '7 Seater Ergonomic SUV',
    bootSpace: '450 Litres (Expandable to 1050L)',
    groundClearance: '200 mm',
    colors: [
      { name: 'Midnight Black', hex: '#09090b' },
      { name: 'Electric Blue', hex: '#1d4ed8' },
      { name: 'Everest White', hex: '#f4f4f5' },
      { name: 'Dazzling Silver', hex: '#94a3b8' },
    ],
    keyFeatures: [
      'Level-2 ADAS: Adaptive Cruise Control, Lane Keep Assist, AEB',
      'Dual 10.25-inch Floating SuperScreens with AdrenoX',
      'Sony 12-Speaker 3D Surround Immersive Audio',
      'Panoramic Panoramic Skyroof with Rain Sensor Close',
    ],
  },
  'Harrier Dark Edition': {
    engine: '2.0L Kryotec Turbocharged Diesel BS6 Phase-2',
    power: '170 bhp @ 3750 rpm',
    torque: '350 Nm @ 1750-2500 rpm',
    transmission: '6-Speed Automatic Torque Converter',
    fuelType: 'Diesel',
    mileage: '16.8 km/l ARAI',
    safetyRating: '⭐⭐⭐⭐⭐ (5-Star Global NCAP)',
    seating: '5 Seater Sport SUV',
    bootSpace: '445 Litres',
    groundClearance: '205 mm',
    colors: [
      { name: 'Oberon Black (Dark)', hex: '#0f172a' },
      { name: 'Ash Grey', hex: '#334155' },
      { name: 'Coral Red', hex: '#991b1b' },
    ],
    keyFeatures: [
      'Dark Edition Blackstone Leatherette Interior',
      'Advanced ESP with 14 Electronic Stability Functions',
      '10.25-inch Harman Infotainment with Wireless Projection',
      'Aero-blade 19-inch Blackout Diamond Cut Alloy Wheels',
    ],
  },
  'Creta SX(O)': {
    engine: '1.5L U2 CRDi Diesel / 1.5L Turbo GDi Petrol',
    power: '160 bhp @ 5500 rpm',
    torque: '253 Nm @ 1500-3500 rpm',
    transmission: '7-Speed Dual Clutch Transmission (DCT)',
    fuelType: 'Petrol / Diesel',
    mileage: '18.4 km/l ARAI',
    safetyRating: '⭐⭐⭐⭐ (4-Star NCAP)',
    seating: '5 Seater Smart SUV',
    bootSpace: '433 Litres',
    groundClearance: '190 mm',
    colors: [
      { name: 'Ranger Khaki', hex: '#57534e' },
      { name: 'Abyss Black', hex: '#18181b' },
      { name: 'Atlas White', hex: '#f8fafc' },
      { name: 'Titan Grey', hex: '#475569' },
    ],
    keyFeatures: [
      'Voice-Enabled Smart Panoramic Sunroof',
      'Bose Premium 8-Speaker Sound System',
      'Hyundai SmartSense Level-2 Autonomous Safety',
      'Ventilated Front Seats & 8-Way Power Driver Seat',
    ],
  },
  'Fortuner Legender': {
    engine: '2.8L 4-Cylinder DOHC 16V Turbo Diesel',
    power: '204 bhp @ 3400 rpm',
    torque: '500 Nm @ 1600-2800 rpm',
    transmission: '6-Speed Automatic with Paddle Shift & Sequential Shift',
    fuelType: 'Diesel',
    mileage: '14.2 km/l ARAI',
    safetyRating: '⭐⭐⭐⭐⭐ (5-Star ASEAN NCAP)',
    seating: '7 Seater Tough SUV',
    bootSpace: '296 Litres (All Rows Up)',
    groundClearance: '225 mm',
    colors: [
      { name: 'Platinum Pearl White with Black Roof', hex: '#f1f5f9' },
      { name: 'Attitude Black', hex: '#0f172a' },
    ],
    keyFeatures: [
      'Catamaran Style Front Bumper with Split Quad-LED Headlamps',
      'Auto Limited Slip Differential (Auto-LSD)',
      'Hands-Free Kick Sensor Powered Tailgate',
      'Dual Zone Fully Automatic Air Conditioning',
    ],
  },
  'Swift ZXi+': {
    engine: '1.2L Z-Series 3-Cylinder Dual Jet Petrol',
    power: '82 bhp @ 5700 rpm',
    torque: '112 Nm @ 4300 rpm',
    transmission: '5-Speed Manual / AGS (Auto Gear Shift)',
    fuelType: 'Petrol',
    mileage: '25.75 km/l ARAI Certified',
    safetyRating: '⭐⭐⭐⭐ (4-Star Rating)',
    seating: '5 Seater Hatchback',
    bootSpace: '265 Litres',
    groundClearance: '163 mm',
    colors: [
      { name: 'Luster Blue', hex: '#0284c7' },
      { name: 'Sizzling Red', hex: '#b91c1c' },
      { name: 'Splendid Silver', hex: '#94a3b8' },
      { name: 'Pearl Arctic White', hex: '#f8fafc' },
    ],
    keyFeatures: [
      '9-inch SmartPlay Pro+ Touchscreen with Suzuki Connect',
      '6 Airbags as Standard across all variants',
      'Wireless Smartphone Charger with LED Indicator',
      'Cruise Control & Automatic Climate Control',
    ],
  },
};

export const getCarSpecs = (model: string): CarSpecDetails => {
  for (const [key, details] of Object.entries(CAR_SPECS_DATA)) {
    if (model.toLowerCase().includes(key.toLowerCase())) {
      return {
        engine: details.engine || '1.5L Multi-Point Fuel Injected Engine',
        power: details.power || '115 bhp @ 6000 rpm',
        torque: details.torque || '144 Nm @ 4500 rpm',
        transmission: details.transmission || '6-Speed Manual / Automatic',
        fuelType: details.fuelType || 'Petrol / Diesel',
        mileage: details.mileage || '18.5 km/l ARAI',
        safetyRating: details.safetyRating || '⭐⭐⭐⭐ (4-Star Rated)',
        seating: details.seating || '5 Seater',
        bootSpace: details.bootSpace || '380 Litres',
        groundClearance: details.groundClearance || '190 mm',
        colors: details.colors || [
          { name: 'Midnight Black', hex: '#18181b' },
          { name: 'Arctic White', hex: '#f8fafc' },
          { name: 'Metallic Silver', hex: '#94a3b8' },
          { name: 'Crimson Red', hex: '#dc2626' },
        ],
        keyFeatures: details.keyFeatures || [
          'Touchscreen Infotainment with Wireless Apple CarPlay & Android Auto',
          'Electronic Stability Program (ESP) & Hill Hold Assist',
          'Rear Parking Camera with Dynamic Guidelines',
          'Multi-Function Steering Wheel with Audio & Voice Controls',
        ],
      };
    }
  }

  // Fallback defaults for any car
  return {
    engine: '1.5L Turbocharged High-Efficiency Engine',
    power: '120 bhp @ 5500 rpm',
    torque: '175 Nm @ 2000-4000 rpm',
    transmission: '6-Speed Manual / Automatic',
    fuelType: 'Petrol / Diesel',
    mileage: '19.2 km/l ARAI',
    safetyRating: '⭐⭐⭐⭐ (4-Star Safety Package)',
    seating: '5 Seater',
    bootSpace: '390 Litres',
    groundClearance: '185 mm',
    colors: [
      { name: 'Obsidian Black', hex: '#18181b' },
      { name: 'Pristine White', hex: '#f8fafc' },
      { name: 'Silky Silver', hex: '#94a3b8' },
      { name: 'Royal Blue', hex: '#1e40af' },
    ],
    keyFeatures: [
      'Smart Connectivity with Real-Time Vehicle Telematics',
      'Dual Airbags with ABS + EBD & Cornering Brake Control',
      'Automatic Climate Control with Rear AC Vents',
      'Diamond Cut Dual-Tone Alloy Wheels',
    ],
  };
};
