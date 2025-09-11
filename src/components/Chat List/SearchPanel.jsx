import {  motion } from "motion/react";
import { Search } from "../index";
function SearchPanel() {
    return (
           <motion.div
            initial={{ opacity: 0,}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            className="h-full"
           >
             <Search type="newFriendSearch" />
           </motion.div>
    );
}

export default SearchPanel;