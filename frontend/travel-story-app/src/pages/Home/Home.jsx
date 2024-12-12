import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import {useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosIntance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import Modal from "react-modal";
import { MdAdd } from "react-icons/md";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";

import EmptyImg from '../../assets/Logo.png'
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";

const Home = () => {

    const navigate = useNavigate();

    const [userInfo , setUserInfo] = useState(null);
    const [allStories , setAllStories ] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [FilterType, setFilterType] = useState("");

    const [dateRange, setDateRange] = useState({ form: null, to: null});

    const [travelStories, setTravelStories] = useState([]);

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShow: false,
        type: "add",
        data: null,
    });

    const [openViewModal, setOpenViewModal] = useState({
        isShown: false,
        data: null,
    });

    // Get User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if(response.data && response.data.user) {
                // Set user info if data exists
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if(error.response.status === 401) {
                // Clear storage is unautorized
                localStorage.clear();
                navigate("/login"); //REdirect to login
            }
        }
    };

    // Get All travel stories
    const getAllTravelStories = async () => {
        try {
            const response = await axiosInstance.get("/get-all-stories");
            if (response.data && response.data.stories) {
                setAllStories(response.data.stories);
            }
        } catch (error) {
            console.log("Aan unexpected error occured", error);
        }
    }

    // Handle edit Story Click
    const handleEdit = (data) => {
        setOpenAddEditModal({isShow: true, type: "edit", data: data});
    }

    // const travel Story click
    const handleViewStory = (data) => {
        setOpenViewModal({ isShown: true, data });
    };

    // Handel Update Favourite
    const updateIsFavourite = async (storyData) => {
        const storyId = storyData._id;
    
        // Actualización optimista: actualizamos antes de recibir respuesta
        setTravelStories((prevStories) =>
            prevStories.map((story) =>
                story._id === storyId 
                    ? { ...story, isFavourite: !story.isFavourite } // Cambiamos el favorito
                    : story
            )
        );
    
        try {
            const response = await axiosInstance.put(
                "/update-is-favourite/" + storyId,
                {
                    isFavourite: !storyData.isFavourite,
                }
            );
    
            if (response.data) {
                toast.success("Updated Successfully");
                
                getAllTravelStories();
            } else {
                throw new Error("No response data");
            }
        } catch (error) {
            console.log("An unexpected error occurred", error);
        }
    };

    // Delete Story
    const deleteTravelStory = async (data) => {
        const storyId = data._id;

        try {
            const response = await axiosInstance.delete("/delete-story/" + storyId);

            if(response.data && !response.data.error) {
                toast.error("Story Delete Successfully");
                setOpenViewModal((prevState) => ({ ...prevState, isShown: false}));
                getAllTravelStories();
            }
        } catch (error) {
            // Handle unexpected errors
            console.log("An unexpected error ocurred, Please try again.")
        }
    }

    // Search Story
    const onSearchStory = async (query) => {
        try {
            const response = await axiosInstance.get("/search", {
                params: {
                    query,
                },
            });

            if(response.data && response.data.stories) {
                setFilterType("search");
                setAllStories(response.data.stories);
            }

        } catch (error) {
            // Handle unexpected errors
            console.log("An unexpected error ocurred, Please try again.", {error})
        }
    }

    const handleClearSearch = () => {
        setFilterType("");
        getAllTravelStories();
    }

    const filterStoriesByDate = async (day) => {
        try {
            const startDate = day.from ? moment(day.from).valueOf() : null;
            const endDate = day.to ? moment(day.to).valueOf() : null;

            if(startDate && endDate) {
                const response = await axiosInstance.get("/travel-stories/filter", {
                    params: {startDate, endDate},
                });

                if(response.data && response.data.stories) {
                    setFilterType("date");
                    setAllStories(response.data.stories);
                }
            }
        } catch (error) {
            console.log("An unexpected error ocurred, Plese try again")
        }
    }

    const handleDayClick = (day) => {
        setDateRange(day);
        filterStoriesByDate(day);
    }

    const resetFilter = () => {
        setDateRange({form: null, to: null});
        getAllTravelStories();
        setFilterType("");
    }

    useEffect(() => {
        getAllTravelStories();
        getUserInfo();

        return () => {};
    }, []);

    return (
        <>
            <Navbar 
                userInfo={userInfo} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
                onSearchNote={onSearchStory}
                handleClearSearch={handleClearSearch}
            />

            <div className='container mx-auto py-10'>

                <FilterInfoTitle 
                    filterType={FilterType}
                    filterDates={dateRange}
                    onClear={() => {
                        resetFilter();
                    }}
                />

                <div className='flex gap-7'>
                    <div className='flex-1'>
                        {allStories.length > 0 ? (
                            <div className='grid grid-cols-2 gap-4'>
                                {allStories.map((item) => {
                                    return (
                                        <TravelStoryCard
                                            key={item._id}
                                            imageUrl={item.imageUrl}
                                            title={item.title}
                                            story={item.story}
                                            date={item.visitedDate}
                                            visitedLocation={item.visitedLocation}
                                            isFavourite={item.isFavourite}
                                            onClick={() => handleViewStory(item)}
                                            onFavouriteClick= {() => updateIsFavourite(item)}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <EmptyCard 
                                imgSrc={EmptyImg}
                                message={`Start creatint your first Travel Stoty! Click the 'Add' button to the down your thoghts, ideas, and memories, Let's go startef`}
                            />
                        )} 
                    </div>

                    <div className='w-[350px]'>
                        <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'>
                            <div className='p-3'>
                                <DayPicker 
                                    captionLayout="dropdown-buttons"
                                    mode="range"
                                    selected={dateRange}
                                    onSelected={handleDayClick}
                                    pageNavigation
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add & Edit travel Story Model */}
            <Modal 
                isOpen={openAddEditModal.isShow}
                onRequestClose={() => {}}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        zIndex: 999,
                    },
                }}
                appElement={document.getElementById("root")}
                className='model-box'
            >
                <AddEditTravelStory
                    type={openAddEditModal.type}
                    storyInfo={openAddEditModal.data}
                    onClose={() => {
                        setOpenAddEditModal({ isShow: false, type: "add", data: null })}
                    }
                    getAllTravelStories={getAllTravelStories}
                />
            </Modal>

            {/* View Travel Story Model */}
            <Modal
                isOpen={openViewModal.isShown}
                onRequestClose={() => {}}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        zIndex: 999,
                    },
                }}
                appElement={document.getElementById("root")}
                className='model-box'
            >
                <ViewTravelStory
                    storyInfo={openViewModal.data || null} 
                    onClose={() => {
                        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
                    }}
                    onEditClick={() => {
                        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
                        handleEdit(openViewModal.data || null);
                    }}
                    onDeleteClick={() => {
                        deleteTravelStory(openViewModal.data || null)
                    }}
                />
            </Modal>

            <button
                className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-red-800 hover:text-black fixed right-10 bottom-10'
                onClick={() => {
                    setOpenAddEditModal({ isShow: true, type: "add", data: null })}
                }
            >
                <MdAdd className='text-[32px] text-white hover:text-black'/>
            </button>

            <ToastContainer />
        </>
    )
}

export default Home;