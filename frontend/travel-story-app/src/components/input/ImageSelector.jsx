import { useEffect, useRef, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image, setImage, handleDeleteImg }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const handleRemoveImage = () => {
        setImage(null);
        handleDeleteImg();
    };

    useEffect(() => {
        // Actualiza el preview URL dependiendo del tipo de `image`
        if (typeof image === "string") {
            // Agrega un parámetro único para evitar problemas de caché
            setPreviewUrl(`${image}?t=${new Date().getTime()}`);
        } else if (image) {
            // Crea una URL de vista previa para archivos locales
            const objectUrl = URL.createObjectURL(image);
            setPreviewUrl(objectUrl);

            // Limpia el objeto URL cuando cambie o se desmonte el componente
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        } else {
            // Si no hay imagen, limpia la URL de vista previa
            setPreviewUrl(null);
        }
    }, [image]);

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!previewUrl ? (
                <button
                    className="w-full h-[200px] flex flex-col items-center justify-center gap-4 bg-slate-40 rounded border border-slate-200/50"
                    onClick={onChooseFile}
                >
                    <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
                        <FaRegFileImage className="text-xl text-cyan-500" />
                    </div>
                    <p className="text-sm text-slate-500">Browse image files to upload</p>
                </button>
            ) : (
                <div className="w-full relative">
                    <img
                        src={previewUrl}
                        alt="Selected"
                        className="w-full h-[300px] object-cover rounded-lg"
                    />
                    <button
                        className="btn-small btn-delete absolute top-2 right-2"
                        onClick={handleRemoveImage}
                    >
                        <MdDeleteOutline className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageSelector;
