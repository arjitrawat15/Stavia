/**
 * Image Configuration
 * 
 * Unique images for each hotel, room type, and table type.
 * Using reliable Unsplash image URLs that work immediately.
 * 
 * To use your own images:
 * 1. Place your image files in the `public/` directory
 * 2. Update the paths below (e.g., "/PHOTO_1.jpg")
 */

export const IMAGES = {
  // Hero section - Large landscape image (1920x1080)
  HERO_IMAGE: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop",
  
  // Hotel images - All 10 hotels with unique images (800x600)
  HOTEL1_IMAGE: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop", // Paris Luxury
  HOTEL2_IMAGE: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop", // Barcelona Beach
  HOTEL3_IMAGE: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop", // Switzerland Mountain
  HOTEL4_IMAGE: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop", // Bali Tropical - Hotel Building
  HOTEL5_IMAGE: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop", // NYC Boutique
  HOTEL6_IMAGE: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop", // Dubai Desert
  HOTEL7_IMAGE: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop", // Santorini Coastal
  HOTEL8_IMAGE: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", // Vienna Historic
  HOTEL9_IMAGE: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop", // Costa Rica Jungle
  HOTEL10_IMAGE: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop", // Maldives Island
  
  // Room type images - Different images for each room type
  ROOM_STANDARD: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
  ROOM_DELUXE: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
  ROOM_SUITE: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
  ROOM_VIP_SUITE: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
  ROOM_PRESIDENTIAL: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
  
  // Restaurant images
  RESTAURANT_IMAGE: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=800&fit=crop",
  
  // Table type images - Different images for each table type
  TABLE_STANDARD: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  TABLE_ROMANTIC: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
  TABLE_FAMILY: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop",
  TABLE_VIP: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  TABLE_PARTY: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
  
  // Fallback placeholder (SVG data URI)
  PLACEHOLDER: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e2e8f0;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23cbd5e1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial,sans-serif' font-size='24' fill='%2394a3b8' text-anchor='middle' dy='.3em'%3EImage Placeholder%3C/text%3E%3C/svg%3E"
};

/**
 * Helper function to get image with fallback
 */
export const getImage = (key, fallback = IMAGES.PLACEHOLDER) => {
  return IMAGES[key] || fallback;
};

/**
 * Get room image based on room type
 */
export const getRoomImage = (roomType) => {
  const roomImageMap = {
    'Standard': IMAGES.ROOM_STANDARD,
    'Deluxe': IMAGES.ROOM_DELUXE,
    'Suite': IMAGES.ROOM_SUITE,
    'VIP Suite': IMAGES.ROOM_VIP_SUITE,
    'Presidential': IMAGES.ROOM_PRESIDENTIAL
  };
  return roomImageMap[roomType] || IMAGES.PLACEHOLDER;
};

/**
 * Get table image based on table tags
 */
export const getTableImage = (tags) => {
  if (tags.includes('VIP')) return IMAGES.TABLE_VIP;
  if (tags.includes('Romantic')) return IMAGES.TABLE_ROMANTIC;
  if (tags.includes('Family')) return IMAGES.TABLE_FAMILY;
  if (tags.includes('Party')) return IMAGES.TABLE_PARTY;
  return IMAGES.TABLE_STANDARD;
};
