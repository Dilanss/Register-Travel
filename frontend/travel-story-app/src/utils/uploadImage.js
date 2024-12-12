import axiosInstance from "./axiosIntance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    // Append image file to form data
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post('/image-upload', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.log("An unexpected error occurred", error);
        throw error;
    }
}

export default uploadImage;