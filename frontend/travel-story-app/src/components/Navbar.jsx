import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/Logo.png'
import Profileinfo from './Cards/Profileinfo';
import SearchBar from './input/SearchBar';

const Navbar = ({ userInfo, searchQuery, setSearchQuery, handleClearSearch, onSearchNote }) => {

    const isToken = localStorage.getItem("token");
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    }

    const handleSearch = () => {
        if(searchQuery) {
            onSearchNote(searchQuery);
        }
    };;

    const onClearSearch = () => {
        handleClearSearch();
        setSearchQuery("");
    };

    return (
        <div className='bg-black/90 text-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
            <img src={LOGO} alt="Travel Story"  className='h-9'/>

            {isToken && (
                <>
                    <SearchBar 
                        value={searchQuery}
                        onChange={({target}) => {
                            setSearchQuery(target.value);
                        }}
                        handleSearch={handleSearch}
                        onClearSearch={onClearSearch}
                    />

                    <Profileinfo userInfo={userInfo} onLogout={onLogout} />
                </>
            )}
        </div>
    )
}

export default Navbar;