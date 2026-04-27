export const STATE_COORDS = {
  'andhra pradesh': { lat: 15.9129, lon: 79.7400 },
  'arunachal pradesh': { lat: 28.2180, lon: 94.7278 },
  'assam': { lat: 26.2006, lon: 92.9376 },
  'bihar': { lat: 25.0961, lon: 85.3131 },
  'chhattisgarh': { lat: 21.2787, lon: 81.8661 },
  'goa': { lat: 15.2993, lon: 74.1240 },
  'gujarat': { lat: 22.2587, lon: 71.1924 },
  'haryana': { lat: 29.0588, lon: 76.0856 },
  'himachal pradesh': { lat: 31.1048, lon: 77.1734 },
  'jharkhand': { lat: 23.6102, lon: 85.2799 },
  'karnataka': { lat: 15.3173, lon: 75.7139 },
  'kerala': { lat: 10.8505, lon: 76.2711 },
  'madhya pradesh': { lat: 22.9734, lon: 78.6569 },
  'maharashtra': { lat: 19.7515, lon: 75.7139 },
  'manipur': { lat: 24.6637, lon: 93.9063 },
  'meghalaya': { lat: 25.4670, lon: 91.3662 },
  'mizoram': { lat: 23.1645, lon: 92.9376 },
  'nagaland': { lat: 26.1584, lon: 94.5624 },
  'odisha': { lat: 20.9517, lon: 85.0985 },
  'punjab': { lat: 31.1471, lon: 75.3412 },
  'rajasthan': { lat: 27.0238, lon: 74.2179 },
  'sikkim': { lat: 27.5330, lon: 88.5122 },
  'tamil nadu': { lat: 11.1271, lon: 78.6569 },
  'telangana': { lat: 18.1124, lon: 79.0193 },
  'tripura': { lat: 23.9408, lon: 91.9882 },
  'uttar pradesh': { lat: 26.8467, lon: 80.9462 },
  'uttarakhand': { lat: 30.0668, lon: 79.0193 },
  'west bengal': { lat: 22.9868, lon: 87.8550 },
  'jammu & kashmir': { lat: 33.7782, lon: 76.5762 },
  'delhi (nct)': { lat: 28.7041, lon: 77.1025 },
};

const img = (file) => `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=600`;

export const STATE_HERITAGE = {
  'rajasthan': [
    { pageid: 10001, title: 'Amber Fort', snippet: 'A magnificent hilltop fort blending Rajput and Mughal architecture, located in Amer.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg/960px-20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg' },
    { pageid: 10002, title: 'Kumbhalgarh', snippet: 'A massive Mewar fortress with the second-longest wall in the world, a UNESCO site.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kumbhalgarh_055.jpg/960px-Kumbhalgarh_055.jpg' },
    { pageid: 10003, title: 'Hawa Mahal', snippet: 'The Palace of Winds, a stunning pink sandstone facade with 953 windows.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/960px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg' },
    { pageid: 10004, title: 'Mehrangarh Fort', snippet: 'One of the largest forts in India, built in around 1459 by Rao Jodha.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Mehrangarh_Fort_sanhita.jpg/960px-Mehrangarh_Fort_sanhita.jpg' },
  ],
  'uttar pradesh': [
    { pageid: 10101, title: 'Taj Mahal', snippet: 'An ivory-white marble mausoleum on the bank of the Yamuna, a symbol of love.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/960px-Taj_Mahal_%28Edited%29.jpeg' },
    { pageid: 10102, title: 'Kashi Vishwanath Temple', snippet: 'One of the twelve Jyotirlingas, located in the ancient city of Varanasi.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Kashi_Vishwanath.jpg' },
    { pageid: 10103, title: 'Fatehpur Sikri', snippet: 'A 16th-century city built by Akbar, abandoned due to water shortage.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Fatehput_Sikiri_Buland_Darwaza_gate_2010.jpg/960px-Fatehput_Sikiri_Buland_Darwaza_gate_2010.jpg' },
    { pageid: 10104, title: 'Sarnath', snippet: 'Where Buddha gave his first sermon; home to the iconic Ashoka Pillar.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg/960px-Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg' },
  ],
  'maharashtra': [
    { pageid: 10201, title: 'Ajanta Caves', snippet: 'UNESCO World Heritage site featuring ancient Buddhist cave monuments.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ajanta_%2863%29.jpg/960px-Ajanta_%2863%29.jpg' },
    { pageid: 10202, title: 'Ellora Caves', snippet: 'One of the largest rock-cut monastery-temple cave complexes in the world.', thumbnail: null },
    { pageid: 10203, title: 'Chhatrapati Shivaji Terminus', snippet: 'Historic railway station in Mumbai built in Victorian Gothic style.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Chhatrapati_shivaji_terminus%2C_esterno_01.jpg/960px-Chhatrapati_shivaji_terminus%2C_esterno_01.jpg' },
    { pageid: 10204, title: 'Raigad Fort', snippet: 'A magnificent hill fort that served as the capital of the Maratha Empire.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Nagarkhana%2C_Raigad_Fort%2C_India.jpg/960px-Nagarkhana%2C_Raigad_Fort%2C_India.jpg' },
  ],
  'tamil nadu': [
    { pageid: 10301, title: 'Meenakshi Temple', snippet: 'A historic Hindu temple located on the southern bank of the Vaigai River.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg/960px-An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg' },
    { pageid: 10302, title: 'Brihadisvara Temple', snippet: 'A magnificent Chola era temple in Thanjavur, known for its massive vimana.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg/960px-Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg' },
    { pageid: 10303, title: 'Mahabalipuram', snippet: 'A group of sanctuaries carved out of rock along the Coromandel coast.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/A_collage_of_Mamallapuram_town_Tamil_Nadu_India.jpg/960px-A_collage_of_Mamallapuram_town_Tamil_Nadu_India.jpg' },
    { pageid: 10304, title: 'Ramanathaswamy Temple', snippet: 'Located on Rameswaram island, known for its long, ornate corridors.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ramanathaswamy_temple7.JPG/960px-Ramanathaswamy_temple7.JPG' },
  ],
  'karnataka': [
    { pageid: 10401, title: 'Hampi', snippet: 'The ancient capital of the Vijayanagara Empire, filled with breathtaking ruins.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/960px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg' },
    { pageid: 10402, title: 'Mysore Palace', snippet: 'A historical palace and royal residence, showcasing Indo-Saracenic architecture.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/960px-Mysore_Palace_Morning.jpg' },
    { pageid: 10403, title: 'Gol Gumbaz', snippet: 'The mausoleum of Mohammed Adil Shah in Bijapur, famous for its massive dome.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Gol_Gumbaj2.JPG/960px-Gol_Gumbaj2.JPG' },
    { pageid: 10404, title: 'Pattadakal', snippet: 'A complex of 7th and 8th century Hindu and Jain temples in northern Karnataka.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Pattadakal_000.JPG/960px-Pattadakal_000.JPG' },
  ],
  'madhya pradesh': [
    { pageid: 10501, title: 'Khajuraho Group of Monuments', snippet: 'Famous for their nagara-style architectural symbolism and their erotic sculptures.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/1_Khajuraho.jpg/960px-1_Khajuraho.jpg' },
    { pageid: 10502, title: 'Sanchi Stupa', snippet: 'One of the oldest stone structures in India, commissioned by Emperor Ashoka.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG/960px-East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG' },
    { pageid: 10503, title: 'Gwalior Fort', snippet: 'A massive 8th-century hill fort overlooking the city of Gwalior.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gwalior_Fort_front.jpg/960px-Gwalior_Fort_front.jpg' },
    { pageid: 10504, title: 'Bhimbetka rock shelters', snippet: 'Archaeological site exhibiting the earliest traces of human life in India.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rock_Shelter_8%2C_Bhimbetka_02.jpg/960px-Rock_Shelter_8%2C_Bhimbetka_02.jpg' },
  ],
  'gujarat': [
    { pageid: 10601, title: 'Somnath Temple', snippet: 'First among the twelve Jyotirlinga shrines of Shiva, destroyed and rebuilt several times.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Somanath_mandir_%28cropped%29.jpg/960px-Somanath_mandir_%28cropped%29.jpg' },
    { pageid: 10602, title: 'Rani ki vav', snippet: 'An intricately constructed stepwell located on the banks of Saraswati River.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Rani_ki_vav_02.jpg/960px-Rani_ki_vav_02.jpg' },
    { pageid: 10603, title: 'Dwarkadhish Temple', snippet: 'A Hindu temple dedicated to Krishna, who is worshipped here by the name Dwarkadhish.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Dwarakadheesh_Temple%2C_2014.jpg/960px-Dwarakadheesh_Temple%2C_2014.jpg' },
    { pageid: 10604, title: 'Sun Temple, Modhera', snippet: 'A Hindu temple dedicated to the solar deity Surya located at Modhera village.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Surya_mandhir.jpg/960px-Surya_mandhir.jpg' },
  ],
  'west bengal': [
    { pageid: 10701, title: 'Victoria Memorial', snippet: 'A large marble building in Kolkata, dedicated to the memory of Queen Victoria.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_situated_in_Kolkata.jpg/960px-Victoria_Memorial_situated_in_Kolkata.jpg' },
    { pageid: 10702, title: 'Dakshineswar Kali Temple', snippet: 'A Hindu navaratna temple located on the eastern bank of the Hooghly River.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Dakhineshwar_Temple_beside_the_Hoogly%2C_West_Bengal.JPG/960px-Dakhineshwar_Temple_beside_the_Hoogly%2C_West_Bengal.JPG' },
    { pageid: 10703, title: 'Hazarduari Palace', snippet: 'A grand palace with 1000 doors (out of which 900 are real) located in Murshidabad.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Hazarduari01_debaditya_chatterjee.jpg' },
    { pageid: 10704, title: 'Darjeeling Himalayan Railway', snippet: 'A 2 ft gauge railway that runs between New Jalpaiguri and Darjeeling.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Ministry_of_Railways_India.svg/960px-Ministry_of_Railways_India.svg.png' },
  ],
  'bihar': [
    { pageid: 10801, title: 'Mahabodhi Temple', snippet: 'An ancient Buddhist temple in Bodh Gaya, marking the location where the Buddha attained enlightenment.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mahabodhitemple.jpg/960px-Mahabodhitemple.jpg' },
    { pageid: 10802, title: 'Nalanda University Ruins', snippet: 'The site of an ancient monastic university that flourished under the Gupta Empire.', thumbnail: null },
    { pageid: 10803, title: 'Golghar', snippet: 'A massive granary built by the British in Patna in 1786.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Golghar_%E0%A5%AA.jpg/960px-Golghar_%E0%A5%AA.jpg' },
    { pageid: 10804, title: 'Vishnupad Temple', snippet: 'An ancient temple in Gaya dedicated to Lord Vishnu, featuring a 40-centimeter-long footprint.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Vishnupad_temple_gaya_bihar.jpg/960px-Vishnupad_temple_gaya_bihar.jpg' },
  ],
  'odisha': [
    { pageid: 10901, title: 'Konark Sun Temple', snippet: 'A 13th-century CE Sun temple built in the shape of a colossal chariot.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/960px-Konarka_Temple.jpg' },
    { pageid: 10902, title: 'Jagannath Temple', snippet: 'An important Hindu temple dedicated to Jagannath, a form of Vishnu, in Puri.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Shri_Jagannath_temple.jpg/960px-Shri_Jagannath_temple.jpg' },
    { pageid: 10903, title: 'Lingaraja Temple', snippet: 'One of the oldest and largest temples in Bhubaneswar, dedicated to Harihara.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lingaraj_Temple_%2C_Bhubaneswar.jpg/960px-Lingaraj_Temple_%2C_Bhubaneswar.jpg' },
    { pageid: 10904, title: 'Udayagiri and Khandagiri Caves', snippet: 'Partly natural and partly artificial caves of archaeological, historical and religious importance.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Khandagari_and_Udaygiri_featured_image.jpg/960px-Khandagari_and_Udaygiri_featured_image.jpg' },
  ],
  'kerala': [
    { pageid: 11001, title: 'Padmanabhaswamy Temple', snippet: 'A Hindu temple located in Thiruvananthapuram, known for its vast wealth and intricate architecture.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Sree_Padmanabhaswamy_temple_01.jpg/960px-Sree_Padmanabhaswamy_temple_01.jpg' },
    { pageid: 11002, title: 'Bekal Fort', snippet: 'The largest fort in Kerala, offering a superb view of the Arabian Sea.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Bakel_Fort_Beach_Kasaragod7.jpg/960px-Bakel_Fort_Beach_Kasaragod7.jpg' },
    { pageid: 11003, title: 'Mattancherry Palace', snippet: 'A Portuguese palace popularly known as the Dutch Palace, featuring Kerala murals.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mattancherry_Palace_DSC_0899.JPG/960px-Mattancherry_Palace_DSC_0899.JPG' },
    { pageid: 11004, title: 'Edakkal Caves', snippet: 'Two natural caves known for their ancient petroglyphs dating back to the Neolithic era.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Edakkal_Cave.jpg/960px-Edakkal_Cave.jpg' },
  ],
  'punjab': [
    { pageid: 11101, title: 'Golden Temple', snippet: 'Harmandir Sahib, the holiest Gurdwara and the most important pilgrimage site of Sikhism.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/960px-The_Golden_Temple_of_Amrithsar_7.jpg' },
    { pageid: 11102, title: 'Jallianwala Bagh', snippet: 'A historic garden and memorial of national importance in Amritsar.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jallianwala_Bagh%2C_Amritsar_01.jpg/960px-Jallianwala_Bagh%2C_Amritsar_01.jpg' },
    { pageid: 11103, title: 'Anandpur Sahib', snippet: 'One of the most important sacred places of the Sikhs, closely linked with their religious traditions.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/1_Sri_Kesgarh_Takhat_Anandpur_Sahib_Khalsa_birthplace_Punjab_India.jpg/960px-1_Sri_Kesgarh_Takhat_Anandpur_Sahib_Khalsa_birthplace_Punjab_India.jpg' },
    { pageid: 11104, title: 'Qila Mubarak', snippet: 'A historical monument in the heart of Bathinda, dating back to 90-110 AD.', thumbnail: null },
  ],
  'telangana': [
    { pageid: 11201, title: 'Charminar', snippet: 'A monument and mosque constructed in 1591, which has become the global icon of Hyderabad.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/960px-Charminar_Hyderabad_1.jpg' },
    { pageid: 11202, title: 'Golconda Fort', snippet: 'A citadel and fort known for its acoustic effects and as the former vault of the Koh-i-Noor.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Golconda_Fort_005.jpg/960px-Golconda_Fort_005.jpg' },
    { pageid: 11203, title: 'Ramappa Temple', snippet: 'A Kakatiya era Shiva temple, designated as a UNESCO World Heritage Site.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Ramappa_Temple_%28Human_Scale%29.jpg/960px-Ramappa_Temple_%28Human_Scale%29.jpg' },
    { pageid: 11204, title: 'Chowmahalla Palace', snippet: 'The magnificent palace of the Nizams of Hyderabad state.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Chowmahalla_Palace_01.jpg/960px-Chowmahalla_Palace_01.jpg' },
  ],
  'andhra pradesh': [
    { pageid: 11301, title: 'Venkateswara Temple, Tirumala', snippet: 'A landmark Vaishnavite temple situated in the hill town of Tirumala.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/960px-Tirumala_090615.jpg' },
    { pageid: 11302, title: 'Amaravati Stupa', snippet: 'A ruined Buddhist monument, probably built in phases between the third century BCE and about 250 CE.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/British_Museum_Asia_14.jpg/960px-British_Museum_Asia_14.jpg' },
    { pageid: 11303, title: 'Undavalli Caves', snippet: 'A monolithic example of Indian rock-cut architecture dating to the 4th-5th centuries.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Undavalli_Caves%2C_Vijayawada%2C_Guntur%2C_Andhra_Pradesh%2C_India_%282018%29_1.jpg/960px-Undavalli_Caves%2C_Vijayawada%2C_Guntur%2C_Andhra_Pradesh%2C_India_%282018%29_1.jpg' },
    { pageid: 11304, title: 'Kondapalli Fort', snippet: 'A historic fort built by Prolaya Vema Reddy, located near Vijayawada.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Vijayawada-Kondapalli_Quilla.jpg' },
  ],
  'delhi (nct)': [
    { pageid: 11401, title: 'Red Fort', snippet: 'A historic fort in Old Delhi that served as the main residence of the Mughal Emperors.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/960px-Delhi_fort.jpg' },
    { pageid: 11402, title: 'Qutb Minar', snippet: 'A 73-metre tall minaret, one of the earliest and most prominent examples of Indo-Islamic architecture.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/960px-Qutb_Minar_2022.jpg' },
    { pageid: 11403, title: "Humayun's Tomb", snippet: 'The tomb of the Mughal Emperor Humayun, which inspired the Taj Mahal.', thumbnail: img("Humayun's Tomb, Delhi.jpg") },
    { pageid: 11404, title: 'India Gate', snippet: 'A war memorial on the Kartavya Path commemorating Indian soldiers.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/India_Gate_%28All_India_War_Memorial%29.jpg/960px-India_Gate_%28All_India_War_Memorial%29.jpg' },
  ],
  'assam': [
    { pageid: 11501, title: 'Kamakhya Temple', snippet: 'A revered Hindu temple dedicated to the mother goddess Kamakhya.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kamakhya_Temple_-_DEV_8829.jpg/960px-Kamakhya_Temple_-_DEV_8829.jpg' },
    { pageid: 11502, title: 'Kaziranga National Park', snippet: 'A World Heritage Site hosting two-thirds of the world\'s great one-horned rhinoceroses.', thumbnail: img('Kaziranga National Park Elephant Safari.jpg') },
    { pageid: 11503, title: 'Rang Ghar', snippet: 'One of the oldest surviving amphitheaters in Asia, located in Sivasagar.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Ranghar_-_Assam.jpg/960px-Ranghar_-_Assam.jpg' },
    { pageid: 11504, title: 'Majuli', snippet: 'The world\'s largest river island, known for its Vaishnavite Satras.', thumbnail: img('Majuli Island.jpg') },
  ],
  'haryana': [
    { pageid: 11601, title: 'Kurukshetra', snippet: 'The historical site of the Mahabharata war and the birthplace of the Bhagavad Gita.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Kurukshetra_junction_kkde.jpg' },
    { pageid: 11602, title: 'Pinjore Gardens', snippet: 'A beautiful 17th-century Mughal garden located in Panchkula.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Pinjore_Garden_Panchkula.jpg/960px-Pinjore_Garden_Panchkula.jpg' },
    { pageid: 11603, title: 'Rakhigarhi', snippet: 'One of the largest and oldest settlements of the ancient Indus Valley Civilization.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Rakhigarhi_Harappan_civilization.jpg/960px-Rakhigarhi_Harappan_civilization.jpg' },
    { pageid: 11604, title: 'Sheikh Chilli Tomb', snippet: 'A beautiful Mughal-era mausoleum complex in Thanesar.', thumbnail: null },
  ],
  'himachal pradesh': [
    { pageid: 11701, title: 'Hadimba Devi Temple', snippet: 'An ancient cave temple dedicated to Hidimbi Devi, located in Manali.', thumbnail: null },
    { pageid: 11702, title: 'Kangra Fort', snippet: 'One of the oldest and largest forts in the Himalayas.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Kangra_Fort_%2CHimachal_Pradesh_06.jpg/960px-Kangra_Fort_%2CHimachal_Pradesh_06.jpg' },
    { pageid: 11703, title: 'Key Monastery', snippet: 'A spectacular Tibetan Buddhist monastery located on a picturesque hilltop in Spiti.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/1000_Year_loop.jpg/960px-1000_Year_loop.jpg' },
    { pageid: 11704, title: 'Viceregal Lodge', snippet: 'A grand British-era building in Shimla that once served as the residence of the British Viceroy.', thumbnail: null },
  ],
  'chhattisgarh': [
    { pageid: 11801, title: 'Bhoramdeo Temple', snippet: 'Known as the Khajuraho of Chhattisgarh, famous for its carved stone temples.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Bhoramdeo_Temple%2C_Kawardha.jpg/960px-Bhoramdeo_Temple%2C_Kawardha.jpg' },
    { pageid: 11802, title: 'Sirpur', snippet: 'An ancient site featuring rich Hindu, Buddhist, and Jain heritage.', thumbnail: null },
    { pageid: 11803, title: 'Chitrakote Falls', snippet: 'The broadest waterfall in India, often called the Niagara Falls of India.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chitrakot_waterfalls.JPG/960px-Chitrakot_waterfalls.JPG' },
    { pageid: 11804, title: 'Bastar Palace', snippet: 'The historical headquarters of the Bastar kingdom in Jagdalpur.', thumbnail: null },
  ],
  'jharkhand': [
    { pageid: 11901, title: 'Baidyanath Temple', snippet: 'One of the twelve Jyotirlingas, located in Deoghar.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg/960px-Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg' },
    { pageid: 11902, title: 'Jagannath Temple, Ranchi', snippet: 'A 17th-century temple built in the same architectural style as the Puri temple.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/17th_century_Jagannath_temple_Ranchi_Jharkhand_-_9.jpg/960px-17th_century_Jagannath_temple_Ranchi_Jharkhand_-_9.jpg' },
    { pageid: 11903, title: 'Maluti Temples', snippet: 'A group of 72 extant terracotta temples located in Dumka district.', thumbnail: null },
    { pageid: 11904, title: 'Palamu Forts', snippet: 'Twin historic forts situated on the banks of the Auranga River.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Palamau_Fort.jpg' },
  ],
  'goa': [
    { pageid: 12001, title: 'Basilica of Bom Jesus', snippet: 'A UNESCO World Heritage Site housing the mortal remains of St. Francis Xavier.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg/960px-Front_Elevation_of_Basilica_of_Bom_Jesus.jpg' },
    { pageid: 12002, title: 'Se Cathedral', snippet: 'One of the largest churches in Asia, built to commemorate the Portuguese victory.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Se_Cathedral_from_Rua_Direita.jpg/960px-Se_Cathedral_from_Rua_Direita.jpg' },
    { pageid: 12003, title: 'Aguada Fort', snippet: 'A well-preserved 17th-century Portuguese fort standing on Sinquerim Beach.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Fort_aguada.jpg/960px-Fort_aguada.jpg' },
    { pageid: 12004, title: 'Mangueshi Temple', snippet: 'One of the largest and most frequently visited Hindu temples in Goa.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Shri-Mangesh-Temple%2CGoa.JPG/960px-Shri-Mangesh-Temple%2CGoa.JPG' },
  ],
  'uttarakhand': [
    { pageid: 12101, title: 'Kedarnath Temple', snippet: 'An ancient and highly revered Shiva temple located in the Garhwal Himalayas.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Kedarnath_Temple_in_Rainy_season.jpg/960px-Kedarnath_Temple_in_Rainy_season.jpg' },
    { pageid: 12102, title: 'Badrinath Temple', snippet: 'One of the Char Dham pilgrimage sites, dedicated to Lord Vishnu.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Badrinath_Temple_%2C_Uttarakhand.jpg/960px-Badrinath_Temple_%2C_Uttarakhand.jpg' },
    { pageid: 12103, title: 'Valley of Flowers', snippet: 'A stunning high-altitude Himalayan valley known for its endemic alpine flora.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Valley_of_flowers_national_park%2C_Uttarakhand%2C_India_03_%28edit%29.jpg/960px-Valley_of_flowers_national_park%2C_Uttarakhand%2C_India_03_%28edit%29.jpg' },
    { pageid: 12104, title: 'Jageshwar Dham', snippet: 'A cluster of over 100 ancient stone temples dating between the 7th and 12th centuries.', thumbnail: null },
  ],
  'tripura': [
    { pageid: 12201, title: 'Ujjayanta Palace', snippet: 'A royal palace in Agartala, formerly the meeting place of the Tripura Legislative Assembly.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Ujjayanta_palace_Tripura_State_Museum_Agartala_India.jpg/960px-Ujjayanta_palace_Tripura_State_Museum_Agartala_India.jpg' },
    { pageid: 12202, title: 'Neermahal', snippet: 'A former royal palace built in the middle of Rudrasagar Lake.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Neer_Mahal%2C_the_water_palace_of_Tripura_02.jpg/960px-Neer_Mahal%2C_the_water_palace_of_Tripura_02.jpg' },
    { pageid: 12203, title: 'Unakoti', snippet: 'An ancient Shaivite place of worship with massive rock-cut sculptures.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Unakoti_3.jpg/960px-Unakoti_3.jpg' },
    { pageid: 12204, title: 'Tripura Sundari Temple', snippet: 'One of the 51 Shakti Peethas, situated in Udaipur, Tripura.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Tripura_Sundari_Temple%2C_Udaipur.jpg' },
  ],
  'meghalaya': [
    { pageid: 12301, title: 'Nongriat Living Root Bridges', snippet: 'Incredible bridges formed by training tree roots across rivers over decades.', thumbnail: null },
    { pageid: 12302, title: 'Nartiang Monoliths', snippet: 'The tallest collection of megalithic stones in the Khasi-Jaintia hills.', thumbnail: null },
    { pageid: 12303, title: 'Mawlynnong', snippet: 'Famous as the cleanest village in Asia with rich Khasi heritage.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mawlynnong_-_Cleanest_village_of_Asia.jpg/960px-Mawlynnong_-_Cleanest_village_of_Asia.jpg' },
    { pageid: 12304, title: 'Umiam Lake', snippet: 'A mesmerizing reservoir nestled among the beautiful hills of Shillong.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Umiam_Lake_-_by_Vikramjit_Kakati.png' },
  ],
  'manipur': [
    { pageid: 12401, title: 'Kangla Fort', snippet: 'The ancient capital and traditional seat of the Kingdom of Manipur.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/The_sacred_idols_of_God_Pakhangba_and_his_divine_consort_kept_inside_the_Pakhangba_Temple_in_the_Kangla_Fort_in_Imphal.jpg/960px-The_sacred_idols_of_God_Pakhangba_and_his_divine_consort_kept_inside_the_Pakhangba_Temple_in_the_Kangla_Fort_in_Imphal.jpg' },
    { pageid: 12402, title: 'Loktak Lake', snippet: 'The largest freshwater lake in Northeast India, famous for its phumdis.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/The_Loktak_Lake.jpg/960px-The_Loktak_Lake.jpg' },
    { pageid: 12403, title: 'Shree Govindajee Temple', snippet: 'The largest Vaishnavite temple in Imphal, adjacent to the royal palace.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/FB7A9290.jpg/960px-FB7A9290.jpg' },
    { pageid: 12404, title: 'INA Memorial Complex', snippet: 'Where the Indian National Army first hoisted the Indian tricolor in 1944.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/INA_Memorial%2C_Moirang%2C_Manipur_%2816%29.jpeg/960px-INA_Memorial%2C_Moirang%2C_Manipur_%2816%29.jpeg' },
  ],
  'nagaland': [
    { pageid: 12501, title: 'Kohima War Cemetery', snippet: 'A memorial dedicated to soldiers of the Allied forces who died in WWII.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Cemetery_with_kohima.jpeg/960px-Cemetery_with_kohima.jpeg' },
    { pageid: 12502, title: 'Kachari Ruins', snippet: 'Ancient monolithic pillars in Dimapur from the Kachari civilization.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Kachari_Ruins_%28a_piece_of_history_waiting_to_be_explored%29.jpg/960px-Kachari_Ruins_%28a_piece_of_history_waiting_to_be_explored%29.jpg' },
    { pageid: 12503, title: 'Khonoma Village', snippet: 'India\'s first green village, known for its legendary resistance against the British.', thumbnail: img('Khonoma Village.jpg') },
    { pageid: 12504, title: 'Longwa Village', snippet: 'A unique village located right on the international border with Myanmar.', thumbnail: null },
  ],
  'arunachal pradesh': [
    { pageid: 12601, title: 'Tawang Monastery', snippet: 'The largest Buddhist monastery in India, nestled high in the Himalayas.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Tawang_Monastery_%28Tibetan_Buddhist%29.jpg/960px-Tawang_Monastery_%28Tibetan_Buddhist%29.jpg' },
    { pageid: 12602, title: 'Ziro Valley', snippet: 'Home to the Apatani tribe and recognized for its beautiful pine hills and rice fields.', thumbnail: null },
    { pageid: 12603, title: 'Ita Fort', snippet: 'An irregular fort built with millions of bricks dating back to the 14th century.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Ita_Fort_01.JPG/960px-Ita_Fort_01.JPG' },
    { pageid: 12604, title: 'Namdapha National Park', snippet: 'A massive biodiversity hotspot with ancient forests and unique tribal heritage.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Forest_snow_Namdapha_IMG_3373_04.jpg/960px-Forest_snow_Namdapha_IMG_3373_04.jpg' },
  ],
  'mizoram': [
    { pageid: 12701, title: 'Solomon\'s Temple', snippet: 'A majestic marble temple in Aizawl, unique in its architecture in the region.', thumbnail: img('Solomons Temple Aizawl.jpg') },
    { pageid: 12702, title: 'Vantawng Falls', snippet: 'The highest waterfall in Mizoram, surrounded by lush bamboo forests.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Vantawng_Khawhthla.jpg' },
    { pageid: 12703, title: 'Reiek', snippet: 'A heritage village providing a glimpse into the traditional Mizo way of life.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Reiek.JPG/960px-Reiek.JPG' },
    { pageid: 12704, title: 'Phawngpui', snippet: 'Known as the Blue Mountain, it is highly revered in local Mizo folklore.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/2007-blue-mtn-farpak.jpg' },
  ],
  'sikkim': [
    { pageid: 12801, title: 'Rumtek Monastery', snippet: 'One of the most important and largest Tibetan Buddhist monasteries in Sikkim.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vikramjit-Kakati-Rumtek.jpg' },
    { pageid: 12802, title: 'Nathula Pass', snippet: 'A historic mountain pass that was part of the ancient Silk Road.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Location_of_Nathula.svg/960px-Location_of_Nathula.svg.png' },
    { pageid: 12803, title: 'Pemayangtse Monastery', snippet: 'A premier monastery of the Nyingma order, established in the 17th century.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Main_Shrine_of_Pemangytse_Gompa_with_prayer_flags.jpg/960px-Main_Shrine_of_Pemangytse_Gompa_with_prayer_flags.jpg' },
    { pageid: 12804, title: 'Rabdentse Ruins', snippet: 'The ruins of the former capital of the Kingdom of Sikkim from 1670 to 1814.', thumbnail: null },
  ],
  'jammu & kashmir': [
    { pageid: 12901, title: 'Mata Vaishno Devi', snippet: 'A world-famous Hindu pilgrimage site located in the Trikuta Mountains.', thumbnail: null },
    { pageid: 12902, title: 'Mughal Gardens, Srinagar', snippet: 'Spectacular terraced gardens built by Mughal Emperors around Dal Lake.', thumbnail: null },
    { pageid: 12903, title: 'Shankaracharya Temple', snippet: 'An ancient Shiva temple situated on top of the Shankaracharya Hill in Srinagar.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/The_Ancient_Shankaracharya_Temple_%28Srinagar%2C_Jammu_and_Kashmir%29_%28cropped%29.jpg/960px-The_Ancient_Shankaracharya_Temple_%28Srinagar%2C_Jammu_and_Kashmir%29_%28cropped%29.jpg' },
    { pageid: 12904, title: 'Martand Sun Temple', snippet: 'The impressive ruins of an 8th-century Kashmiri Hindu temple.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Martand_Sun_Temple_Central_shrine_%286133772365%29.jpg/960px-Martand_Sun_Temple_Central_shrine_%286133772365%29.jpg' },
  ],
  // Fallback for smaller/other states to prevent errors
  'default': [
    { pageid: 99901, title: 'Regional Heritage Site', snippet: 'A significant historical location that shaped the culture of this state.', thumbnail: null },
    { pageid: 99902, title: 'State Museum', snippet: 'Housing antiquities, artifacts, and historical treasures of the region.', thumbnail: null },
    { pageid: 99903, title: 'Ancient Temple Ruins', snippet: 'Remnants of early architectural marvels dedicated to local deities.', thumbnail: null },
    { pageid: 99904, title: 'Historical Fort', snippet: 'A strategic military installation that guarded the regional borders.', thumbnail: null },
  ]
};

export const STATE_ICONS = {
  'rajasthan': [
    { pageid: 'icon-raj-1', title: 'Maharana Pratap', snippet: 'Legendary Rajput warrior king of Mewar.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Maharana_Pratap_By_Surendra_Singh_Shaktawat.jpg/960px-Maharana_Pratap_By_Surendra_Singh_Shaktawat.jpg' },
    { pageid: 'icon-raj-2', title: 'Rana Sanga', snippet: 'Powerful Rajput ruler who united Rajput clans.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Photo_of_Rana_Sanga_from_Udaipur_Museum_%28From_my_Camera%29.jpg' },
    { pageid: 'icon-raj-3', title: 'Sawai Jai Singh II', snippet: 'Founder of Jaipur and a great astronomer.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/1_Maharaja_Sawai_Jai_Singh_II_ca_1725_Jaipur._British_museum.jpg' },
    { pageid: 'icon-raj-4', title: 'Mirabai', snippet: 'Mystic poet and devotee of Krishna.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Kangra_painting_of_Mirabai%2C_the_female_Bhakti_saint.jpg' },
  ],
  'uttar pradesh': [
    { pageid: 'icon-up-1', title: 'Rani Lakshmibai', snippet: 'Warrior queen of Jhansi and icon of the 1857 rebellion.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Rani_of_jhansi.jpg' },
    { pageid: 'icon-up-2', title: 'Kabir', snippet: 'Mystic poet and saint of the Bhakti movement.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Kabir004.jpg' },
    { pageid: 'icon-up-3', title: 'Tulsidas', snippet: 'Poet-saint who composed the Ramcharitmanas.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Goswami_Tulsidas_Awadhi_Hindi_Poet.jpg/960px-Goswami_Tulsidas_Awadhi_Hindi_Poet.jpg' },
    { pageid: 'icon-up-4', title: 'Akbar', snippet: 'Mughal emperor who built Fatehpur Sikri.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Govardhan._Akbar_With_Lion_and_Calf_ca._1630%2C_Metmuseum_%28cropped%29.jpg/960px-Govardhan._Akbar_With_Lion_and_Calf_ca._1630%2C_Metmuseum_%28cropped%29.jpg' },
  ],
  'maharashtra': [
    { pageid: 'icon-mh-1', title: 'Shivaji Maharaj', snippet: 'Founder of the Maratha Empire and a great warrior king.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Shivaji_British_Museum.jpg/960px-Shivaji_British_Museum.jpg' },
    { pageid: 'icon-mh-2', title: 'B. R. Ambedkar', snippet: 'Architect of the Indian Constitution and social reformer.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/960px-Dr._Bhimrao_Ambedkar.jpg' },
    { pageid: 'icon-mh-3', title: 'Bal Gangadhar Tilak', snippet: 'Key leader of the Indian independence movement.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Bal_Gangadhar_Tilak_%281856-1920%29.webp' },
    { pageid: 'icon-mh-4', title: 'Ahilyabai Holkar', snippet: 'Noble Queen of the Maratha Malwa kingdom.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Ahilya_Bai_Holkar_2025_stamp_of_India.jpg' },
  ],
  'tamil nadu': [
    { pageid: 'icon-tn-1', title: 'Raja Raja Chola I', snippet: 'One of the greatest emperors of the Chola dynasty.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Raraja_detail.png' },
    { pageid: 'icon-tn-2', title: 'Subramania Bharati', snippet: 'Pioneering Tamil poet and independence activist.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Subramanya_Bharathi.jpg' },
    { pageid: 'icon-tn-3', title: 'Thiruvalluvar', snippet: 'Celebrated Tamil poet and philosopher, author of the Tirukkural.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Stamp_of_India_-_1960_-_Colnect_141769_-_1_-_Thiruvalluvar_Commemoration.jpeg' },
    { pageid: 'icon-tn-4', title: 'K. Kamaraj', snippet: 'Political leader known for his simplicity and educational reforms.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/K_Kamaraj_1976_stamp_of_India_%28cropped%29.jpg' },
  ],
  'karnataka': [
    { pageid: 'icon-ka-1', title: 'Krishnadevaraya', snippet: 'The greatest ruler of the Vijayanagara Empire.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Chinnadevi%2C_Krishnadevaraya%2C_Tirumaladevi_statues_at_Chandragiri_Museum.jpg/960px-Chinnadevi%2C_Krishnadevaraya%2C_Tirumaladevi_statues_at_Chandragiri_Museum.jpg' },
    { pageid: 'icon-ka-2', title: 'Tipu Sultan', snippet: 'The Tiger of Mysore, known for his resistance against the British.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/TipuSultan1790.jpg/960px-TipuSultan1790.jpg' },
    { pageid: 'icon-ka-3', title: 'Kittur Chennamma', snippet: 'Queen of Kittur, who led an armed rebellion against the British.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Kittur_Chenamma.jpg/960px-Kittur_Chenamma.jpg' },
    { pageid: 'icon-ka-4', title: 'Basava', snippet: '12th-century philosopher, statesman, and social reformer.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Basava_Gaint_Statue_108_feet%2C_Basava_Kalyana.JPG' },
  ],
  'madhya pradesh': [
    { pageid: 'icon-mp-1', title: 'Chandragupta Maurya', snippet: 'Founder of the Maurya Empire who spent his later years as a Jain ascetic.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Lomas_Rishi_entrance.jpg/960px-Lomas_Rishi_entrance.jpg' },
    { pageid: 'icon-mp-2', title: 'Tansen', snippet: 'Legendary Hindustani classical musician in Akbar\'s court.', thumbnail: img('Tansen.jpg') },
    { pageid: 'icon-mp-3', title: 'Rani Durgavati', snippet: 'Ruling Queen of Gondwana known for defending her kingdom against the Mughals.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Rani_Durgavati.jpg' },
    { pageid: 'icon-mp-4', title: 'Kalidasa', snippet: 'Classical Sanskrit author and poet.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kalidasa_inditing_the_cloud_Messenger%2C_A.D._375.jpg/960px-Kalidasa_inditing_the_cloud_Messenger%2C_A.D._375.jpg' },
  ],
  'west bengal': [
    { pageid: 'icon-wb-1', title: 'Rabindranath Tagore', snippet: 'Polymath, poet, and the first non-European to win the Nobel Prize in Literature.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/1926_Rabindrath_Tagore.jpg/960px-1926_Rabindrath_Tagore.jpg' },
    { pageid: 'icon-wb-2', title: 'Subhas Chandra Bose', snippet: 'Prominent Indian nationalist and leader of the Indian National Army.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Subhas_Chandra_Bose_NRB.jpg/960px-Subhas_Chandra_Bose_NRB.jpg' },
    { pageid: 'icon-wb-3', title: 'Swami Vivekananda', snippet: 'Hindu monk and philosopher who introduced Vedanta to the West.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Swami_Vivekananda-1893-09-signed.jpg' },
    { pageid: 'icon-wb-4', title: 'Raja Ram Mohan Roy', snippet: 'Social reformer and founder of the Brahmo Samaj.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Portrait_of_Raja_Ram_Mohun_Roy%2C_1833.jpg/960px-Portrait_of_Raja_Ram_Mohun_Roy%2C_1833.jpg' },
  ],
  'punjab': [
    { pageid: 'icon-pb-1', title: 'Maharaja Ranjit Singh', snippet: 'The Lion of Punjab and founder of the Sikh Empire.', thumbnail: 'https://upload.wikimedia.org/wikipedia/en/f/f0/Company_School_Oval_painting_of_Ranjit_%28Detailed%29.png' },
    { pageid: 'icon-pb-2', title: 'Bhagat Singh', snippet: 'Revolutionary freedom fighter martyred at age 23.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Lahore_conspiracy_case_poster_9th_Oct_193o_jindal_sunam_12x9_copy_%28cropped%29.jpg' },
    { pageid: 'icon-pb-3', title: 'Guru Nanak', snippet: 'The founder of Sikhism and the first of the ten Sikh Gurus.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Mural_painting_of_Guru_Nanak_from_Gurdwara_Baba_Atal_Rai.jpg' },
    { pageid: 'icon-pb-4', title: 'Lala Lajpat Rai', snippet: 'The Lion of Punjab, author, and independence activist.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Mahatma_Lala_Lajpat_Rai.jpg/960px-Mahatma_Lala_Lajpat_Rai.jpg' },
  ],
  'gujarat': [
    { pageid: 'icon-gj-1', title: 'Mahatma Gandhi', snippet: 'Leader of the Indian independence movement against British rule.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/960px-Mahatma-Gandhi%2C_studio%2C_1931.jpg' },
    { pageid: 'icon-gj-2', title: 'Sardar Vallabhbhai Patel', snippet: 'The Iron Man of India, responsible for the integration of princely states.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Sardar_patel_%28cropped%29.jpg' },
    { pageid: 'icon-gj-3', title: 'Vikram Sarabhai', snippet: 'Physicist and astronomer who initiated space research in India.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Dr_Vikram_Sarabhai_ISRO.webp' },
    { pageid: 'icon-gj-4', title: 'Narsinh Mehta', snippet: '15th-century poet-saint of Gujarat.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Stamp_of_India_-_1967_-_Colnect_239713_-_Commemoration_Narsinha_Mehta_-_Poet.jpeg' },
  ],
  'delhi (nct)': [
    { pageid: 'icon-dl-1', title: 'Prithviraj Chauhan', snippet: 'The last major Hindu king to rule Delhi.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Posthumous_painting_depicting_Prithviraj_Chauhan_from_Kota_%28colour%29.jpg' },
    { pageid: 'icon-dl-2', title: 'Razia Sultan', snippet: 'The first and only female ruler of the Delhi Sultanate.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Painting_of_Razia_Sultana_of_the_Delhi_Sultanate%2C_from_the_lacquer-binding_cover_of_a_manuscript_of_Tulsi_Das%27_%27Ramcharitmanas%27%2C_ca.1830%E2%80%9336.jpg/960px-Painting_of_Razia_Sultana_of_the_Delhi_Sultanate%2C_from_the_lacquer-binding_cover_of_a_manuscript_of_Tulsi_Das%27_%27Ramcharitmanas%27%2C_ca.1830%E2%80%9336.jpg' },
    { pageid: 'icon-dl-3', title: 'Shah Jahan', snippet: 'Mughal Emperor who moved the capital to Delhi.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/%27Jujhar_Singh_Bundela_Kneels_in_Submission_to_Shah_Jahan%27%2C_painted_by_Bichitr%2C_c._1630%2C_Chester_Beatty_Library_%28cropped2%29.jpg' },
    { pageid: 'icon-dl-4', title: 'Mirza Ghalib', snippet: 'One of the most prominent Urdu and Persian poets.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Mirza_Ghalib_photograph_3.jpg' },
  ],
  'assam': [
    { pageid: 'icon-as-1', title: 'Lachit Borphukan', snippet: 'A legendary Ahom commander known for his leadership in the Battle of Saraighat.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Status_of_lachit_borphhukon_and_ahom_sibsagar_%28cropped%29.jpg' },
    { pageid: 'icon-as-2', title: 'Srimanta Sankardev', snippet: 'A 15th-century saint-scholar and cultural icon of Assam.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Sankaradeva.jpg' },
    { pageid: 'icon-as-3', title: 'Bhupen Hazarika', snippet: 'Renowned playback singer, poet, and filmmaker of Assam.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Dr._Bhupen_Hazarika%2C_Assam%2C_India.jpg/960px-Dr._Bhupen_Hazarika%2C_Assam%2C_India.jpg' },
    { pageid: 'icon-as-4', title: 'Gopinath Bordoloi', snippet: 'The first Chief Minister of Assam and a prominent freedom fighter.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Gopinath_Bordoloi.jpg' },
  ],
  'haryana': [
    { pageid: 'icon-hr-1', title: 'Kalpana Chawla', snippet: 'The first woman of Indian origin to go to space.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Kalpana_Chawla%2C_NASA_photo_portrait_in_orange_suit.jpg/960px-Kalpana_Chawla%2C_NASA_photo_portrait_in_orange_suit.jpg' },
    { pageid: 'icon-hr-2', title: 'Sir Chhotu Ram', snippet: 'A prominent politician and champion of farmers\' rights.', thumbnail: img('Sir Chhotu Ram.jpg') },
    { pageid: 'icon-hr-3', title: 'Hem Chandra Vikramaditya', snippet: 'A Hindu emperor who successfully defeated the Mughals in several battles.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Hemu_captured_by_Akbar%27s_forces_in_1556.jpg' },
    { pageid: 'icon-hr-4', title: 'Kapil Dev', snippet: 'Legendary Indian cricketer who led India to its first World Cup victory.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Kapil_Dev_at_Equation_sports_auction_%283x4_cropped%29.jpg' },
  ],
  'himachal pradesh': [
    { pageid: 'icon-hp-1', title: 'Yashwant Singh Parmar', snippet: 'The founder and first Chief Minister of Himachal Pradesh.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Yashwant_Singh_Parmar_1988_stamp_of_India.jpg/960px-Yashwant_Singh_Parmar_1988_stamp_of_India.jpg' },
    { pageid: 'icon-hp-2', title: 'Captain Vikram Batra', snippet: 'A highly decorated officer of the Indian Army, martyred in the Kargil War.', thumbnail: null },
    { pageid: 'icon-hp-3', title: 'Norah Richards', snippet: 'An Irish-born actress later known as the "Lady Gregory of Punjab".', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/03/NorahRichards1940.png' },
    { pageid: 'icon-hp-4', title: 'Sobha Singh', snippet: 'A famous contemporary painter known for his Sikh religious artwork.', thumbnail: null },
  ],
  'chhattisgarh': [
    { pageid: 'icon-cg-1', title: 'Veer Narayan Singh', snippet: 'A prominent freedom fighter who led the 1857 rebellion in Chhattisgarh.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Veer_Narayan_Singh_1987_stamp_of_India.jpg' },
    { pageid: 'icon-cg-2', title: 'Teejan Bai', snippet: 'A legendary exponent of Pandavani, a traditional performing art.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Teejan_Bai_performing_at_Bharat_Bhawan_Bhopal_%282%29.jpg/960px-Teejan_Bai_performing_at_Bharat_Bhawan_Bhopal_%282%29.jpg' },
    { pageid: 'icon-cg-3', title: 'Guru Ghasidas', snippet: 'A prominent saint and founder of the Satnami community in the region.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Guru_Ghasidas_1987_stamp_of_India.jpg' },
    { pageid: 'icon-cg-4', title: 'Habib Tanvir', snippet: 'One of the most popular Indian Urdu, Hindi playwrights.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Indian_Writer_Habib_Tanvir.jpg/960px-Indian_Writer_Habib_Tanvir.jpg' },
  ],
  'jharkhand': [
    { pageid: 'icon-jh-1', title: 'Birsa Munda', snippet: 'An Indian tribal freedom fighter, religious leader, and folk hero.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Birsa_Munda%2C_photograph_in_Roy_%281912-72%29.JPG' },
    { pageid: 'icon-jh-2', title: 'Albert Ekka', snippet: 'A posthumous recipient of the Param Vir Chakra from the Indo-Pakistani War.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Albert_Ekka_2000_stamp_of_India.jpg' },
    { pageid: 'icon-jh-3', title: 'Jaipal Singh Munda', snippet: 'A politician, writer, and captain of the 1928 Olympic gold-winning hockey team.', thumbnail: 'https://upload.wikimedia.org/wikipedia/en/8/89/Jaipal_Singh_Munda-_File_Picture.jpg' },
    { pageid: 'icon-jh-4', title: 'Mahendra Singh Dhoni', snippet: 'Legendary Indian cricketer who captained India to multiple global titles.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/MS_Dhoni_%28Prabhav_%2723_-_RiGI_2023%29.jpg' },
  ],
  'goa': [
    { pageid: 'icon-go-1', title: 'Tristão de Bragança Cunha', snippet: 'Widely considered the father of Goan nationalism.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/T._B._Cunha_in_his_40s.jpg/960px-T._B._Cunha_in_his_40s.jpg' },
    { pageid: 'icon-go-2', title: 'Lata Mangeshkar', snippet: 'The Nightingale of India, whose family hailed from Goa.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Lata-Mangeshkar.jpg' },
    { pageid: 'icon-go-3', title: 'Abbe Faria', snippet: 'A Goan Catholic monk and a pioneer of the scientific study of hypnotism.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/ABBE_FARIA.jpg/960px-ABBE_FARIA.jpg' },
    { pageid: 'icon-go-4', title: 'Jack Sequeira', snippet: 'Prominent politician who campaigned to keep Goa an independent territory.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Portrait_of_Dr._Jack_de_Sequeira.jpg/960px-Portrait_of_Dr._Jack_de_Sequeira.jpg' },
  ],
  'uttarakhand': [
    { pageid: 'icon-uk-1', title: 'Govind Ballabh Pant', snippet: 'Key figure in India\'s independence movement and former Chief Minister.', thumbnail: img('Govind Ballabh Pant.jpg') },
    { pageid: 'icon-uk-2', title: 'Sunderlal Bahuguna', snippet: 'A prominent environmentalist and leader of the Chipko movement.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Sunderlal_Bahuguna_at_New_Tehri_cropped.jpg' },
    { pageid: 'icon-uk-3', title: 'Goura Devi', snippet: 'A grassroots activist who played a vital role in the Chipko movement.', thumbnail: null },
    { pageid: 'icon-uk-4', title: 'Sumitranandan Pant', snippet: 'One of the most celebrated poets of the Hindi language.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Sumitranandan_Pant_2015_stamp_of_India.jpg' },
  ],
  'tripura': [
    { pageid: 'icon-tr-1', title: 'Bir Bikram Kishore Debbarma', snippet: 'Considered the father of modern architecture in Tripura.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Maharaja_bir_bikram_manikya.jpg' },
    { pageid: 'icon-tr-2', title: 'Sachin Dev Burman', snippet: 'One of the most celebrated music composers in the Indian film industry.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Sachin_Dev_Burman_%281930s%29.jpg' },
    { pageid: 'icon-tr-3', title: 'Radha Kishore Manikya', snippet: 'A progressive monarch who patronized Rabindranath Tagore.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Raja_Radha_Kishore_Manikya.jpg' },
    { pageid: 'icon-tr-4', title: 'Dipa Karmakar', snippet: 'The first Indian female gymnast to compete in the Olympics.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Deepa_Karmakar_%28cropped%29.jpg' },
  ],
  'meghalaya': [
    { pageid: 'icon-ml-1', title: 'U Tirot Sing', snippet: 'A Khasi chief who rebelled against the British East India Company.', thumbnail: null },
    { pageid: 'icon-ml-2', title: 'Pa Togan Sangma', snippet: 'A Garo warrior and leader who fought bravely against the British.', thumbnail: null },
    { pageid: 'icon-ml-3', title: 'U Kiang Nangbah', snippet: 'A Jaintia patriot who led an uprising against British forces.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/U_Kiang_Nangbah_2001_stamp_of_India.jpg' },
    { pageid: 'icon-ml-4', title: 'Capt. Williamson A. Sangma', snippet: 'The founding Chief Minister of Meghalaya.', thumbnail: null },
  ],
  'manipur': [
    { pageid: 'icon-mn-1', title: 'Tikendrajit Singh', snippet: 'A prince of Manipur who commanded forces against the British.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/BIR_TIKENDRAJIT.jpg' },
    { pageid: 'icon-mn-2', title: 'Mary Kom', snippet: 'An Olympic medalist and six-time World Amateur Boxing Champion.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Mary_Kom_-_British_High_Commission%2C_Delhi%2C_27_July_2011.jpg/960px-Mary_Kom_-_British_High_Commission%2C_Delhi%2C_27_July_2011.jpg' },
    { pageid: 'icon-mn-3', title: 'Rani Gaidinliu', snippet: 'A Naga spiritual and political leader who led a revolt against British rule.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Rani_Gaidinliu_1996_stamp_of_India.jpg' },
    { pageid: 'icon-mn-4', title: 'Ratan Thiyam', snippet: 'One of the most important and influential theatre directors in India.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/The_Vice_President%2C_Shri_M._Venkaiah_Naidu_presenting_the_Legends_of_India_-_Lifetime_Achievement_Award_to_renowned_Theatre_personality%2C_Shri_Ratan_Thiyam%2C_in_New_Delhi_on_August_31%2C_2018.JPG/960px-thumbnail.jpg' },
  ],
  'nagaland': [
    { pageid: 'icon-nl-1', title: 'A. Z. Phizo', snippet: 'A prominent Naga nationalist leader.', thumbnail: null },
    { pageid: 'icon-nl-2', title: 'Neiphiu Rio', snippet: 'The longest-serving Chief Minister of Nagaland.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/NeiphiuRio.jpg' },
    { pageid: 'icon-nl-3', title: 'T. Aliba Imti', snippet: 'A founding figure in Naga politics and literature.', thumbnail: null },
    { pageid: 'icon-nl-4', title: 'Dr. T. Ao', snippet: 'The first captain of the independent Indian football team.', thumbnail: null },
  ],
  'arunachal pradesh': [
    { pageid: 'icon-ap-1', title: 'Dorjee Khandu', snippet: 'A former Chief Minister known for infrastructure development.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Dorjee_Khandu.jpg' },
    { pageid: 'icon-ap-2', title: 'Talmizur Rahman', snippet: 'A celebrated historian of the region.', thumbnail: null },
    { pageid: 'icon-ap-3', title: 'Daying Ering', snippet: 'A pioneering political leader who modernized Arunachal governance.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Daying_Ering_portrait.jpg' },
    { pageid: 'icon-ap-4', title: 'Mamang Dai', snippet: 'A celebrated poet, novelist, and journalist from Arunachal.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mamang_Dai.jpg/960px-Mamang_Dai.jpg' },
  ],
  'mizoram': [
    { pageid: 'icon-mz-1', title: 'Laldenga', snippet: 'The founder of the Mizo National Front and first Chief Minister of Mizoram.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Laldenga.jpg' },
    { pageid: 'icon-mz-2', title: 'Khuangchera', snippet: 'A legendary Mizo warrior who resisted British annexation.', thumbnail: null },
    { pageid: 'icon-mz-3', title: 'Lal Thanhawla', snippet: 'A prominent political leader and multiple-term Chief Minister.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Lalthanhawla.gif' },
    { pageid: 'icon-mz-4', title: 'Ziona', snippet: 'Head of a large Christian sect, known for having the world\'s largest family.', thumbnail: img('Ziona Chana.jpg') },
  ],
  'sikkim': [
    { pageid: 'icon-sk-1', title: 'Chogyal Palden Thondup Namgyal', snippet: 'The last monarch of the Kingdom of Sikkim.', thumbnail: null },
    { pageid: 'icon-sk-2', title: 'Kazi Lhendup Dorjee', snippet: 'The first Chief Minister of Sikkim after its integration with India.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Kazi_Lhendup_Dorjee_.jpg' },
    { pageid: 'icon-sk-3', title: 'Bhaichung Bhutia', snippet: 'Legendary Indian footballer known as the "Sikkimese Sniper".', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Bhaichung_Bhutia_at_the_NDTV_Marks_for_Sports_event_21.jpg' },
    { pageid: 'icon-sk-4', title: 'Pawan Kumar Chamling', snippet: 'The longest-serving Chief Minister of any Indian state.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/77/PawanKumarChamling.jpg' },
  ],
  'jammu & kashmir': [
    { pageid: 'icon-jk-1', title: 'Sheikh Abdullah', snippet: 'Known as the "Lion of Kashmir", a central figure in Kashmiri politics.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Sheikh_Abdullah_1988_stamp_of_India.jpg' },
    { pageid: 'icon-jk-2', title: 'Lalleshwari', snippet: 'A 14th-century mystic poet of the Kashmir Shaivism tradition.', thumbnail: null },
    { pageid: 'icon-jk-3', title: 'Maharaja Hari Singh', snippet: 'The last ruling Maharaja of the princely state of Jammu and Kashmir.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Sir_Hari_Singh_Bahadur%2C_Maharaja_of_Jammu_and_Kashmir%2C_1944.jpg' },
    { pageid: 'icon-jk-4', title: 'Kalhana', snippet: 'A 12th-century Kashmiri historian and author of the Rajatarangini.', thumbnail: null },
  ],
  'default': [
    { pageid: 'icon-def-1', title: 'Regional Ruler', snippet: 'A prominent leader who shaped the state\'s history.', thumbnail: img('Ashoka Pillar at Vaishali.jpg') },
    { pageid: 'icon-def-2', title: 'Freedom Fighter', snippet: 'A local hero of the Indian independence movement.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/August_1985_Muja.jpg/960px-August_1985_Muja.jpg' },
    { pageid: 'icon-def-3', title: 'Cultural Icon', snippet: 'A celebrated poet, writer, or artist from the region.', thumbnail: null },
    { pageid: 'icon-def-4', title: 'Social Reformer', snippet: 'A visionary who brought significant social changes.', thumbnail: null },
  ],
  'andhra pradesh': [
    { pageid: 'icon-ap-1', title: 'Pingali Venkayya', snippet: 'Freedom fighter and the designer of the Indian National Flag.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Pingali_Venkayya_1.jpg' },
    { pageid: 'icon-ap-2', title: 'Alluri Sitarama Raju', snippet: 'Revolutionary leader who led the Rampa Rebellion against the British.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Alluri_Sitarama_Raju_statue.jpg/960px-Alluri_Sitarama_Raju_statue.jpg' },
    { pageid: 'icon-ap-3', title: 'Potti Sreeramulu', snippet: 'Revered as Amarajeevi for his fast unto death for the formation of Andhra State.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Potti_Sreeramulu_2000_stamp_of_India.jpg' },
    { pageid: 'icon-ap-4', title: 'N. T. Rama Rao', snippet: 'Legendary actor and charismatic Chief Minister of Andhra Pradesh.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/NTR_statue.jpg/960px-NTR_statue.jpg' },
  ],
  'bihar': [
    { pageid: 'icon-br-1', title: 'Ashoka the Great', snippet: 'One of India\'s greatest emperors who spread Buddhism across Asia.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Ashoka_Chakra.svg/960px-Ashoka_Chakra.svg.png' },
    { pageid: 'icon-br-2', title: 'Rajendra Prasad', snippet: 'The first President of independent India and a key freedom fighter.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Dr_Rajendra_Prasad_First_President_Of_India.jpg/960px-Dr_Rajendra_Prasad_First_President_Of_India.jpg' },
    { pageid: 'icon-br-3', title: 'Jayaprakash Narayan', snippet: 'Hero of the Quit India Movement and leader of the Total Revolution.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Jayaprakash_Narayan.jpg' },
    { pageid: 'icon-br-4', title: 'Veer Kunwar Singh', snippet: 'Notable leader during the Indian Rebellion of 1857.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Kunwar_Singh.jpg/960px-Kunwar_Singh.jpg' },
  ],
  'kerala': [
    { pageid: 'icon-kl-1', title: 'Adi Shankara', snippet: '8th-century Indian philosopher and theologian who consolidated Advaita Vedanta.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Adi_Shankara_murti.jpg/960px-Adi_Shankara_murti.jpg' },
    { pageid: 'icon-kl-2', title: 'Narayana Guru', snippet: 'Social reformer who led a reform movement in Kerala against the caste system.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Narayana_Guru.jpg/960px-Narayana_Guru.jpg' },
    { pageid: 'icon-kl-3', title: 'Raja Ravi Varma', snippet: 'One of the greatest painters in the history of Indian art.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ravi_Varma-photograph.jpg/960px-Ravi_Varma-photograph.jpg' },
    { pageid: 'icon-kl-4', title: 'Pazhassi Raja', snippet: 'The Lion of Kerala who fought a guerrilla war against the British East India Company.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Kerala_Varma_Pazhassi_Raja_statue_at_Pazhassi_Raja_Museum.jpg/960px-Kerala_Varma_Pazhassi_Raja_statue_at_Pazhassi_Raja_Museum.jpg' },
  ],
  'odisha': [
    { pageid: 'icon-or-1', title: 'Kharavela', snippet: 'Great emperor of Kalinga who restored its lost glory.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Hathigumpha_inscription_of_Kharavela.jpg/960px-Hathigumpha_inscription_of_Kharavela.jpg' },
    { pageid: 'icon-or-2', title: 'Biju Patnaik', snippet: 'Eminent politician, aviator, and freedom fighter.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Biju_Patnaik.jpg/960px-Biju_Patnaik.jpg' },
    { pageid: 'icon-or-3', title: 'Madhusudan Das', snippet: 'Known as Utkal Gourav, he was a key architect of modern Odisha.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Madhusudan_Das.jpg/960px-Madhusudan_Das.jpg' },
    { pageid: 'icon-or-4', title: 'Fakir Mohan Senapati', snippet: 'Often referred to as the father of modern Odia literature.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Fakir_Mohan_Senapati.jpg/960px-Fakir_Mohan_Senapati.jpg' },
  ],
  'telangana': [
    { pageid: 'icon-tg-1', title: 'P. V. Narasimha Rao', snippet: 'The 9th Prime Minister of India, known for introducing economic reforms.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/P._V._Narasimha_Rao_in_1992.jpg/960px-P._V._Narasimha_Rao_in_1992.jpg' },
    { pageid: 'icon-tg-2', title: 'Komaram Bheem', snippet: 'Gond tribal leader who fought for the rights of indigenous people against the Nizams.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Komaram_Bheem_2.png' },
    { pageid: 'icon-tg-3', title: 'Rani Rudrama Devi', snippet: 'One of the few ruling queens in Indian history from the Kakatiya dynasty.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Rani_Rudrama_Devi_statue.jpg/960px-Rani_Rudrama_Devi_statue.jpg' },
    { pageid: 'icon-tg-4', title: 'Kaloji Narayana Rao', snippet: 'Eminent poet, freedom fighter, and political activist of Telangana.', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Kaloji_Narayana_Rao.jpg/960px-Kaloji_Narayana_Rao.jpg' },
  ]
};

export const STATE_TIMELINES = {
  'rajasthan': [
    { era: 'Ancient', year: '2500 BCE', title: 'Indus Valley Settlements', description: 'The Kalibangan site reveals evidence of early Harappan civilization in the region.' },
    { era: 'Medieval', year: '734 CE', title: 'Mewar Dynasty Founded', description: 'Bappa Rawal established the Mewar dynasty, which became a bastion of Rajput resistance.' },
    { era: 'Medieval', year: '1192 CE', title: 'Second Battle of Tarain', description: 'Prithviraj Chauhan was defeated, leading to the establishment of Muslim rule in northern India.' },
    { era: 'Medieval', year: '1576 CE', title: 'Battle of Haldighati', description: 'Maharana Pratap clashed with Akbar\'s forces, symbolizing Rajput valor and independence.' },
    { era: 'Early Modern', year: '1727 CE', title: 'Jaipur Established', description: 'Sawai Jai Singh II founded Jaipur, India\'s first planned city based on Vastu Shastra.' },
    { era: 'Modern', year: '1949 CE', title: 'Formation of Rajasthan', description: 'The princely states merged to form the modern state of Rajasthan within independent India.' }
  ],
  'maharashtra': [
    { era: 'Ancient', year: '230 BCE', title: 'Satavahana Rule', description: 'The Satavahana dynasty ruled the region, bringing an era of cultural and economic prosperity.' },
    { era: 'Medieval', year: '13th Century', title: 'Yadava Dynasty', description: 'The Seuna (Yadava) dynasty ruled from Devagiri, fostering Marathi literature and culture.' },
    { era: 'Medieval', year: '1674 CE', title: 'Coronation of Shivaji', description: 'Shivaji Maharaj was crowned Chhatrapati, officially founding the Maratha Empire.' },
    { era: 'Early Modern', year: '1761 CE', title: 'Third Battle of Panipat', description: 'The Marathas suffered a severe defeat, temporarily halting their expansion in the north.' },
    { era: 'Colonial', year: '1885 CE', title: 'INC Founded in Bombay', description: 'The Indian National Congress held its first session in Bombay, igniting the independence movement.' },
    { era: 'Modern', year: '1960 CE', title: 'State of Maharashtra Created', description: 'Following the Samyukta Maharashtra Movement, the state was created for Marathi speakers.' }
  ],
  'uttar pradesh': [
    { era: 'Ancient', year: 'c. 1000 BCE', title: 'Vedic Period Hub', description: 'The Kuru, Panchala, and Kosala kingdoms flourished here, forming the heartland of Vedic culture.' },
    { era: 'Ancient', year: '5th Century BCE', title: 'Rise of Buddhism', description: 'Gautama Buddha delivered his first sermon in Sarnath and attained Mahaparinirvana in Kushinagar.' },
    { era: 'Medieval', year: '1194 CE', title: 'Battle of Chandawar', description: 'Muhammad of Ghor defeated Jayachandra, establishing Sultanate control over the region.' },
    { era: 'Early Modern', year: '1526 CE', title: 'Mughal Era Begins', description: 'Babur established the Mughal Empire, with Agra and Fatehpur Sikri later serving as grand capitals.' },
    { era: 'Colonial', year: '1857 CE', title: 'First War of Independence', description: 'Meerut, Kanpur, and Lucknow became major centers of the 1857 rebellion against the British.' },
    { era: 'Modern', year: '1950 CE', title: 'United Provinces Renamed', description: 'The United Provinces were renamed Uttar Pradesh, becoming India\'s most populous state.' }
  ],
  'karnataka': [
    { era: 'Ancient', year: '3rd Century BCE', title: 'Mauryan Influence', description: 'Emperor Ashoka\'s rock edicts in the region indicate it was part of the southern extent of the Mauryan Empire.' },
    { era: 'Medieval', year: '6th Century CE', title: 'Chalukya Dynasty', description: 'The Chalukyas of Badami rose to power, leaving behind magnificent rock-cut architecture.' },
    { era: 'Medieval', year: '1336 CE', title: 'Vijayanagara Empire Founded', description: 'Harihara and Bukka established the Vijayanagara Empire, which became a powerful bastion of Hindu culture.' },
    { era: 'Early Modern', year: '1565 CE', title: 'Battle of Talikota', description: 'The Vijayanagara Empire fell to the Deccan Sultanates, leading to the destruction of Hampi.' },
    { era: 'Colonial', year: '1799 CE', title: 'Fall of Tipu Sultan', description: 'Tipu Sultan died fighting the British at Srirangapatna, bringing Mysore under indirect British control.' },
    { era: 'Modern', year: '1956 CE', title: 'Unification of Karnataka', description: 'Kannada-speaking regions were unified to form Mysore State, later renamed Karnataka in 1973.' }
  ],
  'tamil nadu': [
    { era: 'Ancient', year: 'c. 300 BCE', title: 'Sangam Period', description: 'A golden age of Tamil literature and culture flourished under the Chera, Chola, and Pandya kingdoms.' },
    { era: 'Medieval', year: '9th Century CE', title: 'Rise of Imperial Cholas', description: 'Vijayalaya Chola revived the Chola dynasty, leading to a massive maritime empire across Southeast Asia.' },
    { era: 'Medieval', year: '1311 CE', title: 'Malik Kafur\'s Invasion', description: 'The Delhi Sultanate\'s forces invaded Madurai, temporarily disrupting traditional Tamil kingdoms.' },
    { era: 'Early Modern', year: '1639 CE', title: 'Madras Founded', description: 'The British East India Company established Fort St. George, foundational to the Madras Presidency.' },
    { era: 'Colonial', year: '1920 CE', title: 'Justice Party Governance', description: 'The Justice Party won the first direct elections, initiating the Dravidian movement and social reforms.' },
    { era: 'Modern', year: '1969 CE', title: 'Renamed Tamil Nadu', description: 'Madras State was officially renamed Tamil Nadu ("Tamil Country") by Chief Minister C. N. Annadurai.' }
  ],
  'west bengal': [
    { era: 'Ancient', year: 'c. 3rd Century BCE', title: 'Gangaridai Kingdom', description: 'Greek accounts mention the powerful Gangaridai kingdom located in the Bengal delta region.' },
    { era: 'Medieval', year: '8th Century CE', title: 'Pala Empire', description: 'The Buddhist Pala dynasty rose to power, fostering art, literature, and learning at Nalanda and Vikramashila.' },
    { era: 'Medieval', year: '1204 CE', title: 'Bakhtiyar Khalji\'s Conquest', description: 'Islamic rule was established in Bengal, leading to the long-lasting Bengal Sultanate.' },
    { era: 'Colonial', year: '1757 CE', title: 'Battle of Plassey', description: 'The British East India Company defeated Nawab Siraj-ud-Daulah, marking the start of British rule in India.' },
    { era: 'Colonial', year: '1905 CE', title: 'Partition of Bengal', description: 'Lord Curzon partitioned Bengal, sparking massive nationalist protests and the Swadeshi movement.' },
    { era: 'Modern', year: '1947 CE', title: 'Independence and Partition', description: 'Bengal was partitioned along religious lines, with West Bengal joining India and East Bengal becoming East Pakistan.' }
  ],
  'punjab': [
    { era: 'Ancient', year: 'c. 2500 BCE', title: 'Indus Valley Civilization', description: 'Major sites like Harappa indicate Punjab was a cradle of one of the world\'s earliest civilizations.' },
    { era: 'Medieval', year: '1469 CE', title: 'Birth of Sikhism', description: 'Guru Nanak Dev founded Sikhism in Punjab, emphasizing social equality and monotheism.' },
    { era: 'Early Modern', year: '1799 CE', title: 'Sikh Empire', description: 'Maharaja Ranjit Singh unified the disparate Misls to form a powerful, secular Sikh Empire.' },
    { era: 'Colonial', year: '1919 CE', title: 'Jallianwala Bagh Massacre', description: 'British troops fired on unarmed Indians gathered in Amritsar, galvanizing the independence movement.' },
    { era: 'Modern', year: '1947 CE', title: 'Partition of India', description: 'The partition caused massive demographic shifts and divided Punjab between India and Pakistan.' },
    { era: 'Modern', year: '1966 CE', title: 'Punjab Reorganization', description: 'The state was reorganized on linguistic lines, creating the modern states of Punjab and Haryana.' }
  ],
  'andhra pradesh': [
    { era: 'Ancient', year: '2nd Century BCE', title: 'Satavahana Empire', description: 'The Satavahanas ruled a vast empire from Amaravati, fostering trade and spreading Buddhism.' },
    { era: 'Medieval', year: '12th Century CE', title: 'Kakatiya Dynasty', description: 'The Kakatiyas of Warangal built impressive temples and irrigation networks across the Telugu land.' },
    { era: 'Medieval', year: '1509 CE', title: 'Vijayanagara Glory', description: 'Krishnadevaraya ascended the throne, leading the Vijayanagara Empire to its cultural and military zenith.' },
    { era: 'Early Modern', year: '1512 CE', title: 'Qutb Shahi Dynasty', description: 'The Qutb Shahi dynasty established the Golconda Sultanate, known for its diamond trade and architecture.' },
    { era: 'Modern', year: '1953 CE', title: 'Creation of Andhra State', description: 'Following Potti Sreeramulu\'s fast, Andhra State was created as India\'s first linguistic state.' },
    { era: 'Modern', year: '2014 CE', title: 'State Bifurcation', description: 'Andhra Pradesh was officially bifurcated to create the new state of Telangana.' }
  ],
  'bihar': [
    { era: 'Ancient', year: 'c. 500 BCE', title: 'Rise of Magadha', description: 'Magadha emerged as the most powerful Mahajanapada, laying the foundation for India\'s greatest empires.' },
    { era: 'Ancient', year: '321 BCE', title: 'Mauryan Empire', description: 'Chandragupta Maurya established the Mauryan Empire with its capital at Pataliputra (modern Patna).' },
    { era: 'Ancient', year: '4th Century CE', title: 'Golden Age of Guptas', description: 'The Gupta Empire flourished, marking significant advancements in science, mathematics, and literature.' },
    { era: 'Medieval', year: '1540 CE', title: 'Suri Empire', description: 'Sher Shah Suri defeated the Mughals and established his capital at Sasaram, building the Grand Trunk Road.' },
    { era: 'Colonial', year: '1917 CE', title: 'Champaran Satyagraha', description: 'Mahatma Gandhi launched his first major non-violent resistance movement in India against indigo planters.' },
    { era: 'Modern', year: '2000 CE', title: 'Bifurcation of Bihar', description: 'The southern, mineral-rich tribal region of Bihar was separated to form the state of Jharkhand.' }
  ],
  'gujarat': [
    { era: 'Ancient', year: 'c. 2400 BCE', title: 'Indus Valley Civilization', description: 'Lothal and Dholavira flourished as major maritime trade centers of the ancient Harappan civilization.' },
    { era: 'Ancient', year: '319 CE', title: 'Gupta and Maitraka Rule', description: 'The region saw prosperous rule under the Guptas, followed by the Maitrakas of Valabhi.' },
    { era: 'Medieval', year: '10th Century CE', title: 'Chaulukya Dynasty', description: 'The Solanki (Chaulukya) dynasty ruled Gujarat, creating magnificent architecture like the Sun Temple at Modhera.' },
    { era: 'Medieval', year: '1407 CE', title: 'Gujarat Sultanate', description: 'Muzaffar Shah I declared independence from Delhi, establishing a wealthy and powerful maritime sultanate.' },
    { era: 'Colonial', year: '1930 CE', title: 'Dandi March', description: 'Mahatma Gandhi led the historic Salt March from Sabarmati Ashram to Dandi, sparking mass civil disobedience.' },
    { era: 'Modern', year: '1960 CE', title: 'Formation of Gujarat', description: 'Following the Mahagujarat Movement, the Bombay state was bifurcated to create the linguistic state of Gujarat.' }
  ],
  'kerala': [
    { era: 'Ancient', year: 'c. 3rd Century BCE', title: 'Early Chera Dynasty', description: 'The Chera kings ruled the Malabar Coast, establishing thriving spice trade networks with Romans and Greeks.' },
    { era: 'Medieval', year: '825 CE', title: 'Kollam Era Begins', description: 'The Malayalam calendar (Kollavarsham) was established, marking a distinct cultural identity for the region.' },
    { era: 'Early Modern', year: '1498 CE', title: 'Arrival of Vasco da Gama', description: 'Vasco da Gama landed in Calicut, opening the sea route from Europe and initiating Portuguese influence.' },
    { era: 'Early Modern', year: '1729 CE', title: 'Rise of Travancore', description: 'Marthanda Varma expanded the Kingdom of Travancore and decisively defeated the Dutch at the Battle of Colachel.' },
    { era: 'Colonial', year: '1924 CE', title: 'Vaikom Satyagraha', description: 'A massive social reform movement was launched to end untouchability and allow entry to temple roads.' },
    { era: 'Modern', year: '1956 CE', title: 'State of Kerala Created', description: 'The Malayalam-speaking regions of Travancore-Cochin and Malabar were merged to form modern Kerala.' }
  ],
  'madhya pradesh': [
    { era: 'Ancient', year: 'c. 3rd Century BCE', title: 'Mauryan Stupas', description: 'Emperor Ashoka commissioned the Great Stupa at Sanchi, making the region a major center of Buddhism.' },
    { era: 'Medieval', year: '10th Century CE', title: 'Chandela Dynasty', description: 'The Chandela Rajput kings built the magnificent, intricately carved temple complex at Khajuraho.' },
    { era: 'Medieval', year: '11th Century CE', title: 'Paramara Rule', description: 'King Bhoja of the Paramara dynasty ruled from Dhar, highly renowned as a patron of arts and literature.' },
    { era: 'Early Modern', year: '18th Century CE', title: 'Maratha Expansion', description: 'The Holkars and Scindias established powerful Maratha states in Malwa and Gwalior.' },
    { era: 'Colonial', year: '1857 CE', title: 'Rebellion in Central India', description: 'Rani Lakshmibai and Tantia Tope fiercely fought British forces across the Central India Agency.' },
    { era: 'Modern', year: '1956 CE', title: 'Formation of Madhya Pradesh', description: 'The state was formed by merging Madhya Bharat, Vindhya Pradesh, and Bhopal with the Central Provinces.' }
  ],
  'odisha': [
    { era: 'Ancient', year: '261 BCE', title: 'Kalinga War', description: 'Emperor Ashoka conquered Kalinga, but the immense bloodshed prompted his profound conversion to Buddhism.' },
    { era: 'Ancient', year: '1st Century BCE', title: 'Mahameghavahana Dynasty', description: 'Emperor Kharavela expanded Kalinga\'s military power and patronized Jain rock-cut architecture at Udayagiri.' },
    { era: 'Medieval', year: '11th Century CE', title: 'Eastern Ganga Dynasty', description: 'King Anantavarman Chodaganga Deva began the construction of the famous Jagannath Temple in Puri.' },
    { era: 'Medieval', year: '13th Century CE', title: 'Sun Temple Built', description: 'King Narasimhadeva I built the spectacular Konark Sun Temple, designed as a massive stone chariot.' },
    { era: 'Colonial', year: '1817 CE', title: 'Paika Rebellion', description: 'Bakshi Jagabandhu led the Paikas in an early and fierce armed rebellion against British East India Company rule.' },
    { era: 'Modern', year: '1936 CE', title: 'Formation of Orissa Province', description: 'Orissa became the first Indian state to be formed on linguistic basis during British rule.' }
  ],
  'telangana': [
    { era: 'Ancient', year: 'c. 2nd Century BCE', title: 'Satavahana Rule', description: 'The region was a core part of the Satavahana Empire, with Kotilingala serving as an important early capital.' },
    { era: 'Medieval', year: '1199 CE', title: 'Kakatiya Golden Age', description: 'Under Ganapati Deva and Rani Rudrama Devi, the Kakatiyas built massive forts and artificial lakes.' },
    { era: 'Early Modern', year: '1512 CE', title: 'Golconda Sultanate', description: 'The Qutb Shahi dynasty established a wealthy sultanate known for the Golconda Fort and diamond trade.' },
    { era: 'Early Modern', year: '1724 CE', title: 'Asaf Jahi Dynasty', description: 'Nizam-ul-Mulk declared independence, establishing the powerful and immensely wealthy Hyderabad State.' },
    { era: 'Modern', year: '1948 CE', title: 'Operation Polo', description: 'The Indian Armed Forces integrated the princely state of Hyderabad into the Indian Union via "Police Action".' },
    { era: 'Modern', year: '2014 CE', title: 'Formation of Telangana', description: 'Following a decades-long movement, Telangana was carved out of Andhra Pradesh to become India\'s 29th state.' }
  ],
  'delhi (nct)': [
    { era: 'Ancient', year: 'c. 1000 BCE', title: 'Indraprastha', description: 'The epic Mahabharata mentions Indraprastha as the grand capital of the Pandavas on the banks of the Yamuna.' },
    { era: 'Medieval', year: '1192 CE', title: 'Delhi Sultanate Established', description: 'Following the defeat of Prithviraj Chauhan, Qutb-ud-din Aibak established the Delhi Sultanate.' },
    { era: 'Early Modern', year: '1526 CE', title: 'Mughal Era Begins', description: 'Babur defeated Ibrahim Lodi at Panipat, bringing Delhi under Mughal control.' },
    { era: 'Early Modern', year: '1639 CE', title: 'Shahjahanabad Built', description: 'Emperor Shah Jahan built a walled city (Old Delhi) containing the Red Fort and Jama Masjid.' },
    { era: 'Colonial', year: '1911 CE', title: 'Capital Shifted', description: 'The British moved the capital of India from Calcutta to Delhi, commissioning the construction of New Delhi.' },
    { era: 'Modern', year: '1947 CE', title: 'Capital of Independent India', description: 'Delhi became the capital of an independent India, witnessing a massive influx of refugees after Partition.' }
  ],
  'assam': [
    { era: 'Ancient', year: 'c. 4th Century', title: 'Kamarupa Kingdom', description: 'The legendary Kamarupa kingdom flourished, ruled by dynasties like the Varmans.' },
    { era: 'Medieval', year: '1228 CE', title: 'Ahom Kingdom Founded', description: 'Sukaphaa established the Ahom kingdom, which would rule Assam for 600 years.' },
    { era: 'Medieval', year: '1671 CE', title: 'Battle of Saraighat', description: 'The Ahoms under Lachit Borphukan successfully defeated the Mughal empire\'s forces.' },
    { era: 'Colonial', year: '1826 CE', title: 'Treaty of Yandabo', description: 'Assam came under British control following the First Anglo-Burmese War.' },
    { era: 'Colonial', year: '1901 CE', title: 'Digboi Refinery', description: 'Asia\'s first oil refinery started operating in Digboi, Assam.' },
    { era: 'Modern', year: '1985 CE', title: 'Assam Accord', description: 'A peace settlement was signed, ending the historic Assam Movement.' }
  ],
  'haryana': [
    { era: 'Ancient', year: 'c. 3000 BCE', title: 'Indus Valley Sites', description: 'Rakhigarhi and Banawali flourished as major urban centers of the Harappan civilization.' },
    { era: 'Ancient', year: 'Vedic Period', title: 'Epic Battles', description: 'Kurukshetra witnessed the legendary Mahabharata war.' },
    { era: 'Medieval', year: '1192 CE', title: 'Battles of Tarain', description: 'Crucial battles between Prithviraj Chauhan and Muhammad Ghori took place in Haryana.' },
    { era: 'Early Modern', year: '1526-1556', title: 'Battles of Panipat', description: 'Three historic battles at Panipat altered the course of Indian history.' },
    { era: 'Colonial', year: '1857 CE', title: 'Revolt of 1857', description: 'Regions like Ambala and Rohtak saw fierce uprisings against British rule.' },
    { era: 'Modern', year: '1966 CE', title: 'Statehood', description: 'Haryana was carved out of Punjab as a separate state on linguistic grounds.' }
  ],
  'himachal pradesh': [
    { era: 'Ancient', year: 'Pre-history', title: 'Early Kingdoms', description: 'Ancient republics (Janapadas) like Audumbaras and Trigarta ruled the Himalayan foothills.' },
    { era: 'Medieval', year: '11th Century', title: 'Rajput Principalities', description: 'Numerous small Rajput states emerged in the hills.' },
    { era: 'Colonial', year: '1864 CE', title: 'Shimla Summer Capital', description: 'The British declared Shimla the summer capital of colonial India.' },
    { era: 'Colonial', year: '1903 CE', title: 'Kalka-Shimla Railway', description: 'The spectacular narrow-gauge railway was opened to connect Shimla.' },
    { era: 'Modern', year: '1948 CE', title: 'Integration', description: 'Chief Commissioner\'s Province of Himachal Pradesh was formed by integrating 30 princely states.' },
    { era: 'Modern', year: '1971 CE', title: 'Full Statehood', description: 'Himachal Pradesh became the 18th state of the Indian Union.' }
  ],
  'chhattisgarh': [
    { era: 'Ancient', year: 'c. 4th Century', title: 'Dakshina Kosala', description: 'The region was known as Dakshina Kosala and was heavily influenced by Buddhism and Hinduism.' },
    { era: 'Medieval', year: '11th Century', title: 'Kalachuri Dynasty', description: 'The Kalachuris ruled the region from Ratanpur, building numerous temples.' },
    { era: 'Early Modern', year: '1741 CE', title: 'Maratha Conquest', description: 'The Bhonsle Marathas of Nagpur captured Chhattisgarh.' },
    { era: 'Colonial', year: '1854 CE', title: 'British Annexation', description: 'Chhattisgarh was annexed into British India under the Doctrine of Lapse.' },
    { era: 'Nationalist', year: '1857 CE', title: 'Sonakhan Rebellion', description: 'Veer Narayan Singh led a fierce tribal revolt against the British.' },
    { era: 'Modern', year: '2000 CE', title: 'New State Formed', description: 'Chhattisgarh was carved out of Madhya Pradesh to become the 26th state of India.' }
  ],
  'jharkhand': [
    { era: 'Ancient', year: 'Antiquity', title: 'Tribal Heartland', description: 'The Chota Nagpur plateau has been home to Munda, Santhal, and Oraon tribes since antiquity.' },
    { era: 'Medieval', year: '16th Century', title: 'Chero Dynasty', description: 'The Chero dynasty established rule in the Palamu region.' },
    { era: 'Colonial', year: '1855 CE', title: 'Santhal Hul', description: 'A massive tribal rebellion led by the Murmu brothers against British and Zamindari oppression.' },
    { era: 'Colonial', year: '1899 CE', title: 'Munda Ulgulan', description: 'Birsa Munda led an armed revolution to assert tribal rights over forests.' },
    { era: 'Colonial', year: '1907 CE', title: 'TISCO Established', description: 'Tata Iron and Steel Company was set up in Jamshedpur, industrializing the region.' },
    { era: 'Modern', year: '2000 CE', title: 'Jharkhand Created', description: 'Following a long statehood movement, Jharkhand was carved out of Bihar.' }
  ],
  'goa': [
    { era: 'Ancient', year: '3rd Century BCE', title: 'Mauryan Rule', description: 'Goa was a part of the Mauryan Empire under Emperor Ashoka.' },
    { era: 'Medieval', year: '11th Century', title: 'Kadamba Dynasty', description: 'The Kadambas ruled Goa, making Chandor and later Govapuri their capitals.' },
    { era: 'Early Modern', year: '1510 CE', title: 'Portuguese Conquest', description: 'Afonso de Albuquerque captured Goa, making it the capital of the Portuguese State of India.' },
    { era: 'Colonial', year: '16th Century', title: 'Goa Inquisition', description: 'A brutal period of religious persecution was initiated by the Portuguese.' },
    { era: 'Modern', year: '1961 CE', title: 'Operation Vijay', description: 'The Indian Armed Forces liberated Goa from 450 years of Portuguese rule.' },
    { era: 'Modern', year: '1987 CE', title: 'Statehood', description: 'Goa was granted statehood, becoming the 25th state of the Indian Union.' }
  ],
  'uttarakhand': [
    { era: 'Ancient', year: 'Antiquity', title: 'Land of Gods', description: 'The region has been a sacred center of Hinduism, hosting the Char Dham.' },
    { era: 'Medieval', year: '13th Century', title: 'Katyuri and Chand Dynasties', description: 'The Katyuri kings built numerous temples, followed by the Chand kings of Kumaon.' },
    { era: 'Early Modern', year: '1790 CE', title: 'Gurkha Conquest', description: 'The Gurkhas of Nepal invaded and occupied Kumaon and Garhwal.' },
    { era: 'Colonial', year: '1815 CE', title: 'Treaty of Sugauli', description: 'Following the Anglo-Nepalese War, the region was ceded to the British.' },
    { era: 'Modern', year: '1970s', title: 'Chipko Movement', description: 'A non-violent ecological movement began here to protect forests from logging.' },
    { era: 'Modern', year: '2000 CE', title: 'Uttarakhand Formed', description: 'Initially named Uttaranchal, it was carved out of Uttar Pradesh as the 27th state.' }
  ],
  'tripura': [
    { era: 'Ancient', year: 'Antiquity', title: 'Mythological Roots', description: 'The history of Tripura is claimed to date back to the epic Mahabharata.' },
    { era: 'Medieval', year: '15th Century', title: 'Manikya Dynasty', description: 'Maha Manikya established the powerful dynasty that ruled Tripura for centuries.' },
    { era: 'Early Modern', year: '1761 CE', title: 'British Suzerainty', description: 'The kingdom of Tripura came under British influence while maintaining internal autonomy.' },
    { era: 'Colonial', year: '1901 CE', title: 'Ujjayanta Palace Built', description: 'The majestic royal palace was constructed by Maharaja Radha Kishore Manikya.' },
    { era: 'Modern', year: '1949 CE', title: 'Merger with India', description: 'The princely state merged with the Indian Union.' },
    { era: 'Modern', year: '1972 CE', title: 'Full Statehood', description: 'Tripura became a full-fledged state of India.' }
  ],
  'meghalaya': [
    { era: 'Ancient', year: 'Pre-history', title: 'Tribal Homelands', description: 'The Khasi, Jaintia, and Garo tribes lived in these hills with unique matrilineal societies.' },
    { era: 'Early Modern', year: '16th Century', title: 'Jaintia Kingdom', description: 'The Jaintia Kingdom emerged as a significant power in the region.' },
    { era: 'Colonial', year: '1833 CE', title: 'British Annexation', description: 'After fierce resistance led by U Tirot Sing, the Khasi hills were annexed.' },
    { era: 'Colonial', year: '1874 CE', title: 'Assam Province', description: 'Shillong became the capital of the newly created British province of Assam.' },
    { era: 'Modern', year: '1970 CE', title: 'Autonomous State', description: 'Meghalaya was created as an autonomous state within Assam.' },
    { era: 'Modern', year: '1972 CE', title: 'Full Statehood', description: 'Meghalaya achieved full statehood.' }
  ],
  'manipur': [
    { era: 'Ancient', year: '33 CE', title: 'Kangleipak Kingdom', description: 'Nongda Lairen Pakhangba ascended the throne, beginning a long continuous dynastic rule.' },
    { era: 'Medieval', year: '15th Century', title: 'Rise of Vaishnavism', description: 'Hinduism, particularly Vaishnavism, began to strongly influence Manipuri culture.' },
    { era: 'Colonial', year: '1891 CE', title: 'Anglo-Manipuri War', description: 'The British defeated Manipuri forces, making it a princely state under British suzerainty.' },
    { era: 'Colonial', year: '1944 CE', title: 'Battle of Imphal', description: 'A turning point in WWII where the British and Indian armies repelled the Japanese invasion.' },
    { era: 'Modern', year: '1949 CE', title: 'Merger Agreement', description: 'Maharaja Bodhchandra Singh signed the agreement merging Manipur into India.' },
    { era: 'Modern', year: '1972 CE', title: 'Full Statehood', description: 'Manipur was elevated from a Union Territory to a full state.' }
  ],
  'nagaland': [
    { era: 'Ancient', year: 'Antiquity', title: 'Naga Tribes', description: 'Various fiercely independent Naga tribes inhabited the rugged hills.' },
    { era: 'Colonial', year: '1832 CE', title: 'British Arrival', description: 'The British first encountered the Naga tribes, leading to decades of conflict.' },
    { era: 'Colonial', year: '1878 CE', title: 'Kohima Outpost', description: 'The British established their headquarters in Kohima, consolidating control.' },
    { era: 'Colonial', year: '1944 CE', title: 'Battle of Kohima', description: 'A brutal WWII battle known as the "Stalingrad of the East" stopped the Japanese advance.' },
    { era: 'Modern', year: '1960 CE', title: '16-Point Agreement', description: 'An agreement was reached with the Government of India to create a separate state.' },
    { era: 'Modern', year: '1963 CE', title: 'Statehood', description: 'Nagaland became the 16th state of the Indian Union.' }
  ],
  'arunachal pradesh': [
    { era: 'Ancient', year: 'Antiquity', title: 'Ancient Kingdoms', description: 'The region features in epics, with sites like Bhismaknagar linked to Mahabharata legends.' },
    { era: 'Medieval', year: '17th Century', title: 'Tawang Monastery Built', description: 'Mera Lama Lodre Gyatso founded the magnificent Tawang Monastery.' },
    { era: 'Colonial', year: '1914 CE', title: 'Simla Accord', description: 'The McMahon Line was drawn, establishing the boundary between British India and Tibet.' },
    { era: 'Modern', year: '1962 CE', title: 'Sino-Indian War', description: 'The region witnessed heavy fighting during the border conflict with China.' },
    { era: 'Modern', year: '1972 CE', title: 'Union Territory', description: 'The North-East Frontier Agency (NEFA) was renamed Arunachal Pradesh.' },
    { era: 'Modern', year: '1987 CE', title: 'Full Statehood', description: 'Arunachal Pradesh became a full state of the Indian Union.' }
  ],
  'mizoram': [
    { era: 'Ancient', year: '16th Century', title: 'Mizo Migration', description: 'The Mizo tribes migrated into the region and established a village-based chiefdom society.' },
    { era: 'Colonial', year: '1890 CE', title: 'British Annexation', description: 'The British formally annexed the Lushai Hills after a series of expeditions.' },
    { era: 'Colonial', year: '1894 CE', title: 'Arrival of Missionaries', description: 'Christian missionaries arrived, transforming the culture and introducing the Latin script.' },
    { era: 'Modern', year: '1959 CE', title: 'Mautam Famine', description: 'A devastating bamboo-death famine sparked widespread political awakening.' },
    { era: 'Modern', year: '1986 CE', title: 'Mizo Peace Accord', description: 'A historic peace accord ended two decades of insurgency in the region.' },
    { era: 'Modern', year: '1987 CE', title: 'Statehood', description: 'Mizoram became the 23rd state of India.' }
  ],
  'sikkim': [
    { era: 'Medieval', year: '1642 CE', title: 'Namgyal Dynasty Founded', description: 'Phuntsog Namgyal was consecrated as the first Chogyal (monarch) of Sikkim.' },
    { era: 'Early Modern', year: '1700s', title: 'Territorial Conflicts', description: 'Sikkim faced invasions from Bhutan and the Gurkhas of Nepal, losing much territory.' },
    { era: 'Colonial', year: '1861 CE', title: 'Treaty of Tumlong', description: 'Sikkim became a de facto protectorate of British India.' },
    { era: 'Modern', year: '1950 CE', title: 'Indo-Sikkim Treaty', description: 'Sikkim continued as an Indian protectorate following Indian independence.' },
    { era: 'Modern', year: '1975 CE', title: 'Merger with India', description: 'Following a referendum, the monarchy was abolished and Sikkim joined India.' },
    { era: 'Modern', year: '2016 CE', title: 'Organic State', description: 'Sikkim became India\'s first fully organic state.' }
  ],
  'jammu & kashmir': [
    { era: 'Ancient', year: '3rd Century BCE', title: 'Mauryan Era', description: 'Emperor Ashoka introduced Buddhism to Kashmir, and built the old city of Srinagar.' },
    { era: 'Medieval', year: '8th Century CE', title: 'Karkota Empire', description: 'Emperor Lalitaditya Muktapida expanded the empire and built the famous Martand Sun Temple.' },
    { era: 'Medieval', year: '1339 CE', title: 'Shah Mir Dynasty', description: 'Shah Mir became the first Muslim ruler of Kashmir, inaugurating the Sultanate era.' },
    { era: 'Early Modern', year: '1846 CE', title: 'Treaty of Amritsar', description: 'The British sold Kashmir to Gulab Singh, creating the princely state of Jammu and Kashmir.' },
    { era: 'Modern', year: '1947 CE', title: 'Instrument of Accession', description: 'Maharaja Hari Singh acceded to India following an invasion by tribal militias.' },
    { era: 'Modern', year: '2019 CE', title: 'Reorganization', description: 'Article 370 was abrogated and the state was reorganized into two Union Territories.' }
  ],
  'default': [
    { era: 'Ancient', year: 'Antiquity', title: 'Early Settlements', description: 'The region saw early human settlements and ancient trade routes establishing its cultural foundation.' },
    { era: 'Medieval', year: 'Middle Ages', title: 'Rise of Regional Kingdoms', description: 'Local dynasties rose to power, building forts, temples, and establishing distinct cultural identities.' },
    { era: 'Early Modern', year: '16th-18th Century', title: 'Era of Empires', description: 'The region was influenced by major empires like the Mughals or Marathas, changing its political landscape.' },
    { era: 'Colonial', year: '19th Century', title: 'British Era', description: 'The region fell under British influence, experiencing both colonial exploitation and the beginnings of modern infrastructure.' },
    { era: 'Nationalist', year: 'Early 20th Century', title: 'Freedom Struggle', description: 'Local leaders and citizens actively participated in the Indian independence movement.' },
    { era: 'Modern', year: '1947 Onwards', title: 'Integration into India', description: 'The state was formally integrated into the Republic of India and began its modern development.' }
  ]
};

export function getFallbackSites(location = '') {
  const locKey = location.trim().toLowerCase();
  if (STATE_HERITAGE[locKey]) return STATE_HERITAGE[locKey];
  return STATE_HERITAGE['default'];
}

export function getFallbackIcons(location = '') {
  const locKey = location.trim().toLowerCase();
  if (STATE_ICONS[locKey]) return STATE_ICONS[locKey];
  return STATE_ICONS['default'];
}

export function getFallbackTimeline(location = '') {
  const locKey = location.trim().toLowerCase();
  if (STATE_TIMELINES[locKey]) return STATE_TIMELINES[locKey];
  return STATE_TIMELINES['default'];
}
