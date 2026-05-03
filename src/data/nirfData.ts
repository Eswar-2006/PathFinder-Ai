export interface NirfUniversity {
    rank: number; // Engineering Rank
    name: string;
    type: 'IIT' | 'NIT' | 'Private' | 'GFTI' | 'Govt';
    location: string;
    score?: string;
    category?: 'Most Popular' | 'Research Heavy';
}

export const NIRF_DATA: NirfUniversity[] = [
    // Top 1-10
    { rank: 1, name: 'IIT Madras', type: 'IIT', location: 'Chennai, TN' },
    { rank: 2, name: 'IIT Delhi', type: 'IIT', location: 'New Delhi' },
    { rank: 3, name: 'IIT Bombay', type: 'IIT', location: 'Mumbai, MH' },
    { rank: 4, name: 'IIT Kanpur', type: 'IIT', location: 'Kanpur, UP' },
    { rank: 5, name: 'IIT Kharagpur', type: 'IIT', location: 'Kharagpur, WB' },
    { rank: 6, name: 'IIT Roorkee', type: 'IIT', location: 'Roorkee, UK' },
    { rank: 7, name: 'IIT Guwahati', type: 'IIT', location: 'Guwahati, Assam' },
    { rank: 8, name: 'IIT Hyderabad', type: 'IIT', location: 'Hyderabad, TS' },
    { rank: 9, name: 'NIT Trichy', type: 'NIT', location: 'Tiruchirappalli, TN' },
    { rank: 10, name: 'IIT BHU', type: 'IIT', location: 'Varanasi, UP' },

    // Top 11-20
    { rank: 11, name: 'VIT Vellore', type: 'Private', location: 'Vellore, TN' },
    { rank: 12, name: 'Jadavpur University', type: 'Govt', location: 'Kolkata, WB' },
    { rank: 13, name: 'SRM Institute', type: 'Private', location: 'Chennai, TN' },
    { rank: 14, name: 'Anna University', type: 'Govt', location: 'Chennai, TN' },
    { rank: 15, name: 'IIT Dhanbad (ISM)', type: 'IIT', location: 'Dhanbad, JH' },
    { rank: 16, name: 'IIT Indore', type: 'IIT', location: 'Indore, MP' },
    { rank: 17, name: 'NIT Surathkal', type: 'NIT', location: 'Surathkal, KA' },
    { rank: 18, name: 'IIT Gandhinagar', type: 'IIT', location: 'Gandhinagar, GJ' },
    { rank: 19, name: 'NIT Rourkela', type: 'NIT', location: 'Rourkela, OD' },
    { rank: 20, name: 'BITS Pilani', type: 'Private', location: 'Pilani, RJ' },

    // Top 21-30
    { rank: 21, name: 'NIT Warangal', type: 'NIT', location: 'Warangal, TS' },
    { rank: 22, name: 'IIT Ropar', type: 'IIT', location: 'Rupnagar, PB' },
    { rank: 23, name: 'Amrita Vishwa Vidyapeetham', type: 'Private', location: 'Coimbatore, TN' },
    { rank: 24, name: 'Jamia Millia Islamia', type: 'Govt', location: 'New Delhi' },
    { rank: 25, name: 'NIT Calicut', type: 'NIT', location: 'Calicut, KL' },
    { rank: 26, name: 'SOA University', type: 'Private', location: 'Bhubaneswar, OD' },
    { rank: 27, name: 'Delhi Tech. Univ. (DTU)', type: 'Govt', location: 'New Delhi' },
    { rank: 28, name: 'IIT Jodhpur', type: 'IIT', location: 'Jodhpur, RJ' },
    { rank: 29, name: 'Thapar Institute', type: 'Private', location: 'Patiala, PB' },
    { rank: 30, name: 'Amity University', type: 'Private', location: 'Noida, UP' },

    // Top 31-40
    { rank: 31, name: 'IIT Mandi', type: 'IIT', location: 'Mandi, HP' },
    { rank: 32, name: 'Chandigarh University', type: 'Private', location: 'Mohali, PB' },
    { rank: 33, name: 'Aligarh Muslim Univ.', type: 'Govt', location: 'Aligarh, UP' },
    { rank: 34, name: 'IIT Patna', type: 'IIT', location: 'Patna, BR' },
    { rank: 35, name: 'KLEF', type: 'Private', location: 'Vaddeswaram, AP' },
    { rank: 36, name: 'Kalasalingam Academy', type: 'Private', location: 'Srivilliputtur, TN' },
    { rank: 37, name: 'KIIT', type: 'Private', location: 'Bhubaneswar, OD' },
    { rank: 38, name: 'SASTRA', type: 'Private', location: 'Thanjavur, TN' },
    { rank: 39, name: 'VNIT Nagpur', type: 'NIT', location: 'Nagpur, MH' },
    { rank: 40, name: 'NIT Silchar', type: 'NIT', location: 'Silchar, Assam' },

    // Top 41-50
    { rank: 41, name: 'ICT Mumbai', type: 'Govt', location: 'Mumbai, MH' },
    { rank: 42, name: 'UPES', type: 'Private', location: 'Dehradun, UK' },
    { rank: 43, name: 'MNIT Jaipur', type: 'NIT', location: 'Jaipur, RJ' },
    { rank: 44, name: 'NIT Durgapur', type: 'NIT', location: 'Durgapur, WB' },
    { rank: 45, name: 'NIT Delhi', type: 'NIT', location: 'New Delhi' },
    { rank: 46, name: 'SSN College of Engg.', type: 'Private', location: 'Kalavakkam, TN' },
    { rank: 47, name: 'IIIT Hyderabad', type: 'Private', location: 'Hyderabad, TS' },
    { rank: 48, name: 'BIT Mesra', type: 'Private', location: 'Ranchi, JH' },
    { rank: 49, name: 'IIEST Shibpur', type: 'GFTI', location: 'Howrah, WB' },
    { rank: 50, name: 'Lovely Professional Univ.', type: 'Private', location: 'Phagwara, PB' },

    // Top 51-60
    { rank: 51, name: 'IIST', type: 'Govt', location: 'Thiruvananthapuram, KL' },
    { rank: 52, name: 'Graphic Era Univ.', type: 'Private', location: 'Dehradun, UK' },
    { rank: 53, name: 'Saveetha Institute', type: 'Private', location: 'Chennai, TN' },
    { rank: 54, name: 'IIT Bhubaneswar', type: 'IIT', location: 'Bhubaneswar, OD' },
    { rank: 55, name: 'NIT Patna', type: 'NIT', location: 'Patna, BR' },
    { rank: 56, name: 'Manipal Inst. Tech', type: 'Private', location: 'Manipal, KA' },
    { rank: 57, name: 'NSUT', type: 'Govt', location: 'New Delhi' },
    { rank: 58, name: 'NIT Jalandhar', type: 'NIT', location: 'Jalandhar, PB' },
    { rank: 59, name: 'SVNIT Surat', type: 'NIT', location: 'Surat, GJ' },
    { rank: 60, name: 'MNNIT Allahabad', type: 'NIT', location: 'Prayagraj, UP' },

    // Top 61-70
    { rank: 61, name: 'IIT Tirupati', type: 'IIT', location: 'Tirupati, AP' },
    { rank: 62, name: 'IIT Jammu', type: 'IIT', location: 'Jammu, JK' },
    { rank: 63, name: 'DIAT', type: 'Govt', location: 'Pune, MH' },
    { rank: 64, name: 'IIT Palakkad', type: 'IIT', location: 'Palakkad, KL' },
    { rank: 65, name: 'Manipal Univ. Jaipur', type: 'Private', location: 'Jaipur, RJ' },
    { rank: 66, name: 'Sathyabama Institute', type: 'Private', location: 'Chennai, TN' },
    { rank: 67, name: 'PSG College of Tech', type: 'Govt', location: 'Coimbatore, TN' },
    { rank: 68, name: 'NIT Meghalaya', type: 'NIT', location: 'Shillong, ML' },
    { rank: 69, name: 'VTU', type: 'Govt', location: 'Belagavi, KA' },
    { rank: 70, name: 'Univ. of Hyderabad', type: 'Govt', location: 'Hyderabad, TS' },

    // Top 71-80
    { rank: 71, name: 'NIT Raipur', type: 'NIT', location: 'Raipur, CG' },
    { rank: 72, name: 'MANIT Bhopal', type: 'NIT', location: 'Bhopal, MP' },
    { rank: 73, name: 'IIT Bhilai', type: 'IIT', location: 'Bhilai, CG' },
    { rank: 74, name: 'IIIT Bangalore', type: 'Private', location: 'Bengaluru, KA' },
    { rank: 75, name: 'M.S. Ramaiah (MSRIT)', type: 'Private', location: 'Bengaluru, KA' },
    { rank: 76, name: 'SLIET', type: 'GFTI', location: 'Longowal, PB' },
    { rank: 77, name: 'COEP Tech Univ.', type: 'Govt', location: 'Pune, MH' },
    { rank: 78, name: 'Banasthali Vidyapith', type: 'Private', location: 'Banasthali, RJ' },
    { rank: 79, name: 'NIT Srinagar', type: 'NIT', location: 'Srinagar, JK' },
    { rank: 80, name: 'RGIPT', type: 'GFTI', location: 'Jais, UP' },

    // Top 81-90
    { rank: 81, name: 'NIT Kurukshetra', type: 'NIT', location: 'Kurukshetra, HR' },
    { rank: 82, name: 'NIT Agartala', type: 'NIT', location: 'Agartala, TR' },
    { rank: 83, name: 'Sri Krishna College', type: 'Private', location: 'Coimbatore, TN' },
    { rank: 84, name: 'MMMUT', type: 'Govt', location: 'Gorakhpur, UP' },
    { rank: 85, name: 'IIIT Delhi', type: 'Govt', location: 'New Delhi' },
    { rank: 86, name: 'Vel Tech', type: 'Private', location: 'Chennai, TN' },
    { rank: 87, name: 'IIIT Allahabad', type: 'GFTI', location: 'Prayagraj, UP' },
    { rank: 88, name: 'JNTU Kakinada', type: 'Govt', location: 'Kakinada, AP' },
    { rank: 89, name: 'GGSIPU', type: 'Govt', location: 'New Delhi' },
    { rank: 90, name: 'Andhra Univ. College', type: 'Govt', location: 'Visakhapatnam, AP' },

    // Top 91-100
    { rank: 91, name: 'Vignan\'s Foundation', type: 'Private', location: 'Guntur, AP' },
    { rank: 92, name: 'Shoolini University', type: 'Private', location: 'Solan, HP' },
    { rank: 93, name: 'NIT Manipur', type: 'NIT', location: 'Imphal, MN' },
    { rank: 94, name: 'Kumaraguru College', type: 'Private', location: 'Coimbatore, TN' },
    { rank: 95, name: 'JNTU Hyderabad', type: 'Govt', location: 'Hyderabad, TS' },
    { rank: 96, name: 'PES University', type: 'Private', location: 'Bengaluru, KA' },
    { rank: 97, name: 'Netaji Subhas Univ', type: 'Private', location: 'Jamshedpur, JH' },
    { rank: 98, name: 'Jaypee Inst. (JIIT)', type: 'Private', location: 'Noida, UP' },
    { rank: 99, name: 'SR University', type: 'Private', location: 'Warangal, TS' },
    { rank: 100, name: 'C.V. Raman Global', type: 'Private', location: 'Bhubaneswar, OD' }
];
