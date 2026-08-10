export const uploadImage = async (image) => {

    const formData = new FormData();

    formData.append("image", image);

    const url = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`;

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!data.success) {

        throw new Error(data.error?.message || "Image upload failed");
    }

    return data.data.url;
};