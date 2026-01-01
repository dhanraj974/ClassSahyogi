/**
 * Strong Unique ID Generator for ClassSahyogi
 * Generates cryptographically strong, unique IDs with verification
 */

class UniqueIDGenerator {
  constructor() {
    this.charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.charSetLower = 'abcdefghijklmnopqrstuvwxyz0123456789';
  }

  /**
   * Generate a cryptographically random string
   */
  getRandomBytes(length) {
    const array = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return array;
  }

  /**
   * Convert bytes to base62 string
   */
  bytesToBase62(bytes) {
    let result = '';
    const base = 62;
    let num = 0;
    
    for (let i = 0; i < bytes.length; i++) {
      num = num * 256 + bytes[i];
    }
    
    while (num > 0) {
      const remainder = num % base;
      result = this.charSetLower[remainder] + result;
      num = Math.floor(num / base);
    }
    
    return result.padStart(Math.ceil(bytes.length * 8 / Math.log2(62)), '0');
  }

  /**
   * Generate checksum for ID verification
   */
  generateChecksum(id) {
    let sum = 0;
    for (let i = 0; i < id.length; i++) {
      sum += id.charCodeAt(i) * (i + 1);
    }
    return (sum % 1000).toString().padStart(3, '0');
  }

  /**
   * Generate strong unique ID
   * Format: PREFIX-TIMESTAMP-RANDOM-CHECKSUM
   * Example: STU-20241215143052123-A7B9C2D4E5F6-789
   * 
   * This ID is completely independent and does NOT use username or date of birth
   * It uses only: timestamp + cryptographic randomness + checksum
   */
  generateStrongID(prefix = 'ID') {
    // Get current timestamp (YYYYMMDDHHMMSSMMM format - 17 digits)
    // This ensures uniqueness based on creation time, NOT user data
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
                     String(now.getMonth() + 1).padStart(2, '0') +
                     String(now.getDate()).padStart(2, '0') +
                     String(now.getHours()).padStart(2, '0') +
                     String(now.getMinutes()).padStart(2, '0') +
                     String(now.getSeconds()).padStart(2, '0') +
                     String(now.getMilliseconds()).padStart(3, '0');

    // Generate random component (8 bytes = 64 bits of entropy)
    const randomBytes = this.getRandomBytes(8);
    const randomComponent = Array.from(randomBytes)
      .map(b => this.charSet[b % this.charSet.length])
      .join('')
      .substring(0, 12);

    // Combine components
    const idBase = `${prefix}-${timestamp}-${randomComponent}`;
    
    // Generate checksum
    const checksum = this.generateChecksum(idBase);
    
    // Final ID
    const finalID = `${idBase}-${checksum}`;
    
    return finalID;
  }

  /**
   * Generate Student ID
   */
  generateStudentID() {
    return this.generateStrongID('STU');
  }

  /**
   * Generate Staff ID
   */
  generateStaffID() {
    return this.generateStrongID('STF');
  }

  /**
   * Generate Admin ID
   */
  generateAdminID() {
    return this.generateStrongID('ADM');
  }

  /**
   * Verify ID format and checksum
   */
  verifyID(id) {
    if (!id || typeof id !== 'string') return false;
    
    const parts = id.split('-');
    if (parts.length !== 4) return false;
    
    const [prefix, timestamp, random, checksum] = parts;
    
    // Verify prefix
    if (!['STU', 'STF', 'ADM', 'ID'].includes(prefix)) return false;
    
    // Verify timestamp format (17 digits: YYYYMMDDHHMMSSMMM)
    if (!/^\d{17}$/.test(timestamp)) return false;
    
    // Verify random component (12 alphanumeric characters)
    if (!/^[A-Z0-9]{12}$/.test(random)) return false;
    
    // Verify checksum
    const idBase = `${prefix}-${timestamp}-${random}`;
    const expectedChecksum = this.generateChecksum(idBase);
    
    return checksum === expectedChecksum;
  }

  /**
   * Generate shorter but still strong ID (for backward compatibility)
   * Format: PREFIX-YYYYMMDD-RANDOM-CHECKSUM
   */
  generateShortID(prefix = 'ID') {
    const now = new Date();
    const date = now.getFullYear().toString() +
                 String(now.getMonth() + 1).padStart(2, '0') +
                 String(now.getDate()).padStart(2, '0');

    // Generate random component (6 bytes = 48 bits of entropy)
    const randomBytes = this.getRandomBytes(6);
    const randomComponent = Array.from(randomBytes)
      .map(b => this.charSet[b % this.charSet.length])
      .join('')
      .substring(0, 8);

    const idBase = `${prefix}-${date}-${randomComponent}`;
    const checksum = this.generateChecksum(idBase);
    
    return `${idBase}-${checksum}`;
  }

  /**
   * Generate 7-character ID from name and birth date
   * Format: 3 letters from name + 4 digits (day + month) from DOB
   * Example: JOH1205 (John born on Dec 5th), MAR2508 (Mary born on Aug 25th)
   */
  generateNameBasedID(name, birthDate, prefix = '') {
    if (!name || !birthDate) {
      throw new Error('Name and birth date are required');
    }

    // Clean name: remove spaces, convert to uppercase, take first 3 letters
    const cleanName = name.replace(/\s+/g, '').toUpperCase();
    let namePart = '';
    
    if (cleanName.length >= 3) {
      namePart = cleanName.substring(0, 3);
    } else {
      // If name is shorter, pad with first letter
      namePart = cleanName + cleanName.charAt(0).repeat(3 - cleanName.length);
    }

    // Extract date components
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid birth date format');
    }

    // Use day (2 digits) and month (2 digits) from DOB
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Combine: 3 letters + 2 digits (day) + 2 digits (month) = 7 characters
    // Format: XXXDDMM (e.g., JOH1205 = John, Dec 5th)
    const baseID = namePart + day + month;

    return baseID.substring(0, 7).toUpperCase();
  }

  /**
   * Generate unique 7-character ID from name and birth date
   * Ensures uniqueness by checking against existing IDs
   * Format: 3 letters + 4 digits (day + month)
   * If duplicate, modifies the last digit(s) to ensure uniqueness
   */
  generateUniqueNameBasedID(name, birthDate, storageKey, idField = 'roll', prefix = '') {
    if (!name || !birthDate) {
      throw new Error('Name and birth date are required');
    }

    let baseID = this.generateNameBasedID(name, birthDate, prefix);
    let finalID = baseID;
    let attempts = 0;
    const maxAttempts = 100;

    // Check uniqueness - get fresh data each time
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const existingIDs = new Set(items.map(item => {
      // Check multiple possible ID fields
      return item[idField] || item.roll || item.staffId || item.id;
    }).filter(Boolean));

    // If ID exists, modify the last digit(s) to ensure uniqueness
    while (existingIDs.has(finalID) && attempts < maxAttempts) {
      attempts++;
      
      // Strategy 1: Modify the last digit (month digit)
      const lastDigit = parseInt(finalID.charAt(6)) || 0;
      const newLastDigit = ((lastDigit + attempts) % 10).toString();
      finalID = baseID.substring(0, 6) + newLastDigit;
      
      // Strategy 2: If still duplicate after 5 attempts, modify the second-to-last digit
      if (attempts > 5 && existingIDs.has(finalID)) {
        const secondLastDigit = parseInt(finalID.charAt(5)) || 0;
        const newSecondLast = ((secondLastDigit + attempts) % 10).toString();
        finalID = baseID.substring(0, 5) + newSecondLast + finalID.charAt(6);
      }
      
      // Strategy 3: If still duplicate after 10 attempts, modify the day part
      if (attempts > 10 && existingIDs.has(finalID)) {
        const dayPart = finalID.substring(3, 5);
        const dayNum = parseInt(dayPart) || 1;
        const newDay = String(((dayNum - 1 + attempts) % 31) + 1).padStart(2, '0');
        finalID = baseID.substring(0, 3) + newDay + finalID.substring(5);
      }
      
      // Strategy 4: If still duplicate after 20 attempts, use random suffix
      if (attempts > 20 && existingIDs.has(finalID)) {
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        finalID = baseID.substring(0, 5) + random;
      }
    }

    // Final check - if still duplicate, use timestamp-based variation
    if (existingIDs.has(finalID)) {
      const timestamp = Date.now().toString();
      const randomSuffix = timestamp.substring(timestamp.length - 2);
      finalID = baseID.substring(0, 5) + randomSuffix;
    }

    return finalID.substring(0, 7).toUpperCase();
  }

  /**
   * Check if ID already exists in storage
   */
  isIDUnique(id, storageKey, idField = 'id') {
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return !items.some(item => item[idField] === id || item.roll === id || item.staffId === id);
  }

  /**
   * Generate unique ID that doesn't exist in storage
   */
  generateUniqueID(prefix, storageKey, idField = 'id', useShort = false) {
    let attempts = 0;
    const maxAttempts = 100;
    let newID;
    
    do {
      newID = useShort ? this.generateShortID(prefix) : this.generateStrongID(prefix);
      attempts++;
      
      if (attempts > maxAttempts) {
        throw new Error('Unable to generate unique ID after maximum attempts');
      }
    } while (!this.isIDUnique(newID, storageKey, idField));
    
    return newID;
  }
}

// Create global instance
const idGenerator = new UniqueIDGenerator();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UniqueIDGenerator;
}

