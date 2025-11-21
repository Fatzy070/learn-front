import React from 'react';
import CourseSlider from '../components/CourseSlider'
const Html = () => {
    return (
        <div>
            <CourseSlider 
            title='HTML Tutorial for Beginners'
            playlistId='PLr6-GrHUlVf_ZNmuQSXdS197Oyr1L9sPB'
            limit={15}
            setLoading={setLoading}
            />
        </div>
    );
};

export default Html;