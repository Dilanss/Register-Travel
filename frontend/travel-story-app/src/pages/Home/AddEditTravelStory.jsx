import { MdAdd, MdClose, MdUpdate } from "react-icons/md"
import DateSelector from "../../components/input/DateSelector"
import { useState } from "react"
import ImageSelector from "../../components/input/ImageSelector";
import TagInput from "../../components/input/TagInput";
import moment from "moment";
import axiosInstance from "../../utils/axiosIntance";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import uploadImage from "../../utils/uploadImage";

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {

    const [title, setTitle] = useState(storyInfo?.title || "");
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(
        storyInfo?.visitedDate ? new Date(storyInfo.visitedDate) : new Date()
    );

    const [error, setError] = useState("");

    // Add New Travel Story
    const addNewTravelStory = async () => {
        try {
            let imageUrl = "";

            // Ipload image if present
            if(storyImg) {
                const imgUploadRes = await uploadImage(storyImg);
                // Get Image Url
                imageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            });

            if(response.data && response.data.story) {
                toast.success("Story Added Successfully");
                // Refesh stories
                getAllTravelStories();
                // Close modal or form
                onClose();
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            } else {
                // Handle unexpected errors
                setError("An unexected erro ocurred, Please try again.");
            } 
        }
    }

    // Update Travel Story
    const updateTravelStory = async () => {
        const storyId = storyInfo._id;

        try {
            let imageUrl = "";

            // Simple mistake
            let postData = {
                title,
                story,
                imageUrl: storyInfo.imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            }

            if (typeof storyImg === "object") {
                const imgUploadRes = await uploadImage(storyImg);
                const newImageUrl = imgUploadRes.imageUrl || "";
            
                postData = {
                    ...postData,
                    imageUrl: newImageUrl,
                };
            
                setStoryImg(newImageUrl); // Esto actualiza el estado
            }
            

            const response = await axiosInstance.put("/edit-story/" + storyId, postData);

            if(response.data && response.data.story) {
                toast.success("Story Updated Successfully");
                // Refesh stories
                getAllTravelStories();
                // Close modal or form
                onClose();
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            } else {
                // Handle unexpected errors
                setError("An unexected erro ocurred, Please try again.");
            } 
        }
    }

    const handleAddDrUpadteClick = () => {
        console.log("Input Data:", { title, storyImg, story, visitedLocation, visitedDate });

        if(!title) {
            setError("Please enter the title");
            return;
        }

        if(!story) {
            setError("Please select the story image");
            return;
        }

        setError("");

        if(type === "edit") {
            updateTravelStory();
        } else {
            addNewTravelStory();
        }
    }

    // Delete Story img and Update the story
    const handleDeleteImg = async () => {
        // Deleting the Image
        const deleteImgRes = await axiosInstance.delete("/delete-image", {
            params: {
                imageUrl: storyInfo.imageUrl,
            },
        });

        if(deleteImgRes.data) {
            const storyId = storyInfo._id;

            const postData = {
                title,
                story,
                visitedLocation,
                visitedDate: moment().valueOf(),
                imageUrl: "",
            };

            // Updating story
            const response = await axiosInstance.put(
                "/edit-story/" + storyId,
                postData
            );
            setStoryImg(null);
        }
    }

    return (
        <div className="relative">
            <div className='flex items-center justify-between'>
            <h5 className='text-xl font-medium text-slate-700'>
                {type === "add" ? "Add Story" : "Update Story"}
            </h5>

                <div>
                    <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                        {type === "add" ? (
                            <button className='btn-small' onClick={handleAddDrUpadteClick}>
                                <MdAdd className='text-lg'/> ADD STORY
                            </button>
                        ) : (
                            <>
                                <button className='btn-small' onClick={handleAddDrUpadteClick}>
                                    <MdUpdate className='text-lg'/> UPDATE STORY
                                </button>
                            </>
                        )}

                        <button className="" onClick={onClose}>
                            <MdClose className='text-xl text-slate-400' />
                        </button>
                    </div>

                    {
                        error && (
                            <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
                        )
                    }
                </div>
            </div>

            <div>
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    {/* Input Text */}
                    <label className="input-label">TITLE</label>
                    <input 
                        type="text" 
                        className='text-2xl text-slate-950 outline-none'
                        placeholder="A Day at the Great Wall"
                        value={title}
                        onChange={({target}) => setTitle(target.value)}
                    />

                    {/* Date */}
                    <div className='my-3'>
                        <DateSelector 
                            date={visitedDate}
                            setDate={setVisitedDate}
                        />
                    </div>
                    
                    {/* Input Image */}
                    <ImageSelector 
                        image={storyImg} 
                        setImage={setStoryImg} 
                        handleDeleteImg={handleDeleteImg}
                    />
                    
                    {/* Input Story */}
                    <div className='flex flex-col gap-2 mt-4'>
                        <label className='input-label'>STORY</label>
                        <textarea 
                            type="text"
                            className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                            placeholder="Your Story"
                            rows={10}
                            value={story}
                            onChange={({target}) => setStory(target.value)}
                        />
                    </div>

                    {/* Input Locations */}
                    <div className="pt-3">
                        <label className='input-label'>VISITED LOCATIONS</label>
                        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditTravelStory;