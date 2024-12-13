import pako from 'pako';

// Uint8ArrayをBase64に変換する関数
const uint8ArrayToBase64 = (uint8Array) => {
  return btoa(String.fromCharCode(...uint8Array));
};

// Base64をUint8Arrayに変換する関数
const base64ToUint8Array = (base64) => {
  return new Uint8Array(
    atob(base64)
      .split('')
      .map((char) => char.charCodeAt(0))
  );
};

export const compressData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const compressed = pako.deflate(jsonString); // Uint8Arrayを生成
    return uint8ArrayToBase64(compressed); // Base64エンコード
  } catch (error) {
    console.error('圧縮エラー:', error);
    return null;
  }
};

export const decompressData = (compressedData) => {
  try {
    const decoded = base64ToUint8Array(compressedData); // Base64デコードしてUint8Arrayを取得
    const decompressed = pako.inflate(decoded, { to: 'string' }); // 解凍して文字列に変換
    return JSON.parse(decompressed); // JSONを解析
  } catch (error) {
    console.error('解凍エラー:', error);
    return null;
  }
};
