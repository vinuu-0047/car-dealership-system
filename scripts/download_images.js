const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../frontend/public/cars');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const cars = [
  {
    name: 'Mahindra Thar 4x4',
    file: 'thar.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02_%28cropped%29.jpg/960px-Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02_%28cropped%29.jpg',
  },
  {
    name: 'Tata Nexon EV',
    file: 'nexon.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Tata_Nexon_Blue_Dual_Tone.jpg/960px-Tata_Nexon_Blue_Dual_Tone.jpg',
  },
  {
    name: 'Mahindra XUV700 AX7',
    file: 'xuv700.png',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png/960px-2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png',
  },
  {
    name: 'Tata Harrier Dark Edition',
    file: 'harrier.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Tata_Buzzard_Sport%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS0651%29.jpg/960px-Tata_Buzzard_Sport%2C_GIMS_2019%2C_Le_Grand-Saconnex_%28GIMS0651%29.jpg',
  },
  {
    name: 'Hyundai Creta SX(O)',
    file: 'creta.png',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/2024_Hyundai_Creta_1.5_MPi_SX%28O%29_%28India%29_front_view.png/960px-2024_Hyundai_Creta_1.5_MPi_SX%28O%29_%28India%29_front_view.png',
  },
  {
    name: 'Kia Seltos X-Line',
    file: 'seltos.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg/960px-Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg',
  },
  {
    name: 'Maruti Suzuki Swift ZXi+',
    file: 'swift.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Suzuki_Swift_%282024%29_hybrid_DSC_6076.jpg/960px-Suzuki_Swift_%282024%29_hybrid_DSC_6076.jpg',
  },
  {
    name: 'Tata Safari Accomplished',
    file: 'safari.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Geneva_MotorShow_2013_-_Tata_Safari_Storme.jpg/960px-Geneva_MotorShow_2013_-_Tata_Safari_Storme.jpg',
  },
  {
    name: 'Mahindra Scorpio-N Z8L',
    file: 'scorpio.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/2024_Mahindra_Scorpio_Z8L_front.jpg/960px-2024_Mahindra_Scorpio_Z8L_front.jpg',
  },
  {
    name: 'Honda City e:HEV Hybrid',
    file: 'city.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Honda_City_1.5_i-VTEC_V_%28VIII%2C_Facelift%29_%E2%80%93_f_22032025.jpg/960px-Honda_City_1.5_i-VTEC_V_%28VIII%2C_Facelift%29_%E2%80%93_f_22032025.jpg',
  },
  {
    name: 'Maruti Suzuki Brezza ZXi',
    file: 'brezza.png',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/2022_Maruti_Suzuki_Brezza_ZXi%2B_%28India%29_front_view_03.png/960px-2022_Maruti_Suzuki_Brezza_ZXi%2B_%28India%29_front_view_03.png',
  },
  {
    name: 'Tata Punch Creative',
    file: 'punch.png',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/2021_Tata_Punch_Creative_%28India%29_front_view_01.png/960px-2021_Tata_Punch_Creative_%28India%29_front_view_01.png',
  },
  {
    name: 'Toyota Fortuner Legender',
    file: 'fortuner.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Toyota_Fortuner_LTD_4x2_20221019.jpg/960px-Toyota_Fortuner_LTD_4x2_20221019.jpg',
  },
  {
    name: 'Maruti Suzuki Dzire ZXi+',
    file: 'dzire.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Suzuki_Dzire_II_1.2_GLX_Hybrid_Arctic_White_Pearl.jpg/960px-Suzuki_Dzire_II_1.2_GLX_Hybrid_Arctic_White_Pearl.jpg',
  },
  {
    name: 'Tata Tiago EV',
    file: 'tiago.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/2022_Tata_Tiago_XZA%2B_front_20230512.jpg/960px-2022_Tata_Tiago_XZA%2B_front_20230512.jpg',
  },
  {
    name: 'Mahindra Bolero Neo N10',
    file: 'bolero.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Mahindra_Bolero_ZLX.jpg/960px-Mahindra_Bolero_ZLX.jpg',
  },
];

async function downloadAll() {
  console.log(`Starting download of ${cars.length} authentic Indian car photos...`);

  for (const car of cars) {
    const destPath = path.join(targetDir, car.file);
    console.log(`Downloading ${car.name} -> ${car.file}...`);
    try {
      const res = await fetch(car.url, {
        headers: {
          'User-Agent': 'CarDealershipInventory/1.0 (contact@cardealership.com) Mozilla/5.0',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(destPath, buffer);
      console.log(`✅ ${car.name} saved (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`❌ Failed ${car.name}:`, err.message);
    }
  }

  console.log('\nAll downloads finished!');
}

downloadAll();
