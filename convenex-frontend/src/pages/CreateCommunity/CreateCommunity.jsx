import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const CreateCommunity = () => {
    const navigate = useNavigate();
    const [communityData, setCommunityData] = useState({
        name: "",
        email: "",
        tagline: "",
        description: "",
        logo: "",
        bannerImage: "",
        category: "",
        visibility: "public",

        socialLinks: {
            website: "",
            github: "",
            linkedin: "",
            discord: "",
            instagram: "",
            twitter: "",
        },
    });

    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCommunityData({
            ...communityData,
            [name]: value,
        });
    };

    const handleSocialLinks = (e) => {
        const { name, value } = e.target;

        setCommunityData({
            ...communityData,
            socialLinks: {
                ...communityData.socialLinks,
                [name]: value,
            },
        });
    };

    const addTag = () => {
        if (!tagInput.trim()) return;

        setTags([...tags, tagInput]);

        setTagInput("");
    };

    const handleCreateCommunity = async () => {
        if (!communityData.name.trim() || !communityData.description.trim() || !communityData.category.trim() || !communityData.email || !communityData.visibility || !communityData.tagline.trim() || !communityData.bannerImage || !communityData.logo) {
            return toast.error("Please fill all required details!");
        }
        const payload = {
            ...communityData,
            tags
        };
        await axios.post("http://localhost:4000/api/community/createCommunity", payload, { withCredentials: true }).then((res) => {
            toast.success("Community created successfully!");
            setTimeout(() => {
                navigate("/allCommunities");
            }, 2000);
        }).catch(err => {
            console.log(err);
            toast.error(err?.data?.response?.error);
        });
    }


    return (
        <div className="min-h-screen bg-[#f5f2f7] p-10">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10">

                <h1 className="text-4xl font-bold text-purple-900 mb-10">
                    Create Community
                </h1>

                <div className="space-y-8">

                    {/* Community Name */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Community Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Community Name"
                            value={communityData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                    </div>

                    {/* Community Email */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Community Email
                        </label>

                        <input
                            type="text"
                            name="email"
                            placeholder="Enter Community Email Address"
                            value={communityData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                    </div>

                    {/* Community Tagline */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Community Tagline
                        </label>

                        <input
                            type="text"
                            name="tagline"
                            maxLength={100}
                            placeholder="Enter Community Tagline"
                            value={communityData.tagline}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Enter Community Description"
                            value={communityData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 h-40"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            placeholder="Enter Community Category"
                            value={communityData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Visibility
                        </label>

                        <select
                            name="visibility"
                            value={communityData.visibility}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        >
                            <option value="public">Public</option>
                            <option value="invite-only">Invite Only</option>
                        </select>
                    </div>

                    {/* Logo */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Logo URL
                        </label>

                        <input
                            type="text"
                            name="logo"
                            placeholder="Enter Logo URL"
                            value={communityData.logo}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                    </div>

                    {/* Banner */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Banner Image URL
                        </label>

                        <input
                            type="text"
                            name="bannerImage"
                            placeholder="Enter Banner Image URL"
                            value={communityData.bannerImage}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block mb-3 font-medium text-gray-700">
                            Tags
                        </label>

                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                placeholder="Enter Tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                            />

                            <button
                                onClick={addTag}
                                className="bg-purple-700 text-white px-5 rounded-xl cursor-pointer"
                            >
                                Add
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-5 text-purple-900">
                            Social Links
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <input
                                type="text"
                                name="website"
                                placeholder="Website"
                                onChange={handleSocialLinks}
                                className="border border-gray-300 rounded-xl px-4 py-3"
                            />

                            <input
                                type="text"
                                name="github"
                                placeholder="GitHub"
                                onChange={handleSocialLinks}
                                className="border border-gray-300 rounded-xl px-4 py-3"
                            />

                            <input
                                type="text"
                                name="linkedin"
                                placeholder="LinkedIn"
                                onChange={handleSocialLinks}
                                className="border border-gray-300 rounded-xl px-4 py-3"
                            />

                            <input
                                type="text"
                                name="discord"
                                placeholder="Discord"
                                onChange={handleSocialLinks}
                                className="border border-gray-300 rounded-xl px-4 py-3"
                            />

                            <input
                                type="text"
                                name="instagram"
                                placeholder="Instagram"
                                onChange={handleSocialLinks}
                                className="border border-gray-300 rounded-xl px-4 py-3"
                            />

                            <input
                                type="text"
                                name="twitter"
                                placeholder="Twitter / X"
                                onChange={handleSocialLinks}
                                className="border border-gray-300 rounded-xl px-4 py-3"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button onClick={handleCreateCommunity}
                        className="cursor-pointer w-full bg-purple-700 hover:bg-purple-800 transition text-white font-semibold py-4 rounded-xl"
                    >
                        Create Community
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CreateCommunity;