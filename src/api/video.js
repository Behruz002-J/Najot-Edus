import axiosClient from "./axios";

/**
 * Returns the complete URL for a video file.
 * Handles full URLs, absolute paths, and raw file names.
 * 
 * @param {string} fileUrlOrPath - The video URL, path, or raw file name
 * @returns {string} The full HTTP URL for the video
 */
export const getVideoFileUrl = (fileUrlOrPath) => {
  if (!fileUrlOrPath) {
    return "https://najot-edu.softwareengineer.uz/files/files/1780340713500.mp4";
  }
  
  if (fileUrlOrPath.startsWith("http")) {
    return fileUrlOrPath;
  }
  
  if (fileUrlOrPath.startsWith("/")) {
    return `https://najot-edu.softwareengineer.uz${fileUrlOrPath}`;
  }
  
  // For raw file names (e.g. "1780295090712.mp4"), construct the correct static endpoint
  return `https://najot-edu.softwareengineer.uz/files/files/${fileUrlOrPath}`;
};

/**
 * Fetches all videos uploaded for a specific group.
 * 
 * @param {string|number} groupId - The ID of the group
 * @returns {Promise<Array>} List of videos
 */
export const getGroupVideos = async (groupId) => {
  try {
    const res = await axiosClient.get(`/files/${groupId}`);
    
    let list = [];
    if (res?.data?.success && Array.isArray(res?.data?.data)) {
      list = res.data.data;
    } else if (Array.isArray(res?.data)) {
      list = res.data;
    } else if (res?.data?.data && Array.isArray(res?.data?.data)) {
      list = res.data.data;
    }
    
    return list;
  } catch (error) {
    console.error("Error fetching group videos:", error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Uploads a video file for a specific group and lesson.
 * 
 * @param {string|number} groupId - The ID of the group
 * @param {string|number} lessonId - The ID of the lesson
 * @param {string} title - Custom title/name for the video
 * @param {File} file - The actual video File object
 * @returns {Promise<any>} Response from the upload endpoint
 */
export const uploadGroupVideo = async (groupId, lessonId, title, file) => {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file. Please select a valid video file.");
  }
  
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    
    const res = await axiosClient.post(
      `/files/group/${groupId}/upload?lessonId=${lessonId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    return res.data;
  } catch (error) {
    console.error("Error uploading video:", error?.response?.data || error.message);
    throw error;
  }
};
