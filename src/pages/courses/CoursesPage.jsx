import React from 'react';
import Course from '../../components/Course'
import Load from '../../components/Load';
import { useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';
const CoursesPage = () => {
    const [loading, setLoading] = useState(true);
    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-purple-600 to-blue-600">
                <div className="flex items-center text-white gap-3 mb-2">
                  <FiBookOpen className="w-8 h-8" />
                  <h1 className="text-3xl font-bold ">Course</h1>
                </div>
                <p className="text-purple-100 text-lg">
                  Your enrolled courses and learning progress
                </p>
              </div>

            {/* {loading && <Load />} */}

            <Course 
            title='JavaScript full course'
            playlistId='PLU83Ru7iGtAtTlQ8MRGHCBu4tzATiRfmY'
            limit={15}
            // setLoading={setLoading}
            />
            <Course 
            title='React full course for beginners'
            playlistId='PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3'
            limit={15}
            setLoading={setLoading}
            />
            <Course 
            title='The Linux basic course for beginner'
            playlistId='PLtK75qxsQaMLZSo7KL-PmiRarU7hrpnwK'
            limit={15}
            // setLoading={setLoading}
            />
            <Course 
            title='Python for beginner'
            playlistId='PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3'
            limit={15}
            // setLoading={setLoading}
            />

            <Course 
            title='HTML Tutorial for Beginners'
            playlistId='PLr6-GrHUlVf_ZNmuQSXdS197Oyr1L9sPB'
            limit={15}
            // setLoading={setLoading}
            />
        </div>
    );
};

export default CoursesPage;