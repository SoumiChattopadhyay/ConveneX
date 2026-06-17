import React, { useEffect, useState } from 'react'
import Card from '../../components/Card/Card';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Post from '../../components/Post/Post';
import Modal from '../../components/Modal/Modal';
import PostModal from '../../components/PostModal/PostModal';
import Loader from '../../components/Loader/Loader';
import Navbar3 from '../../components/NavbarV3/Navbar3';
import CommunityPostModal from '../../components/CommunityPostModal/CommunityPostModal';

const CommunityPosts = () => {
	const { communityId } = useParams();
	const [community, setCommunity] = useState(null);
	const [userData, setUserData] = useState(null);
	const [posts, setPosts] = useState(null);

	const fetchCommunity = async () => {
		await axios.get(`http://localhost:4000/api/community/getCommunity/${communityId}`, { withCredentials: true }).then((res) => {
			// console.log(res);
			setCommunity(res?.data?.community);
		}).catch((err) => {
			toast.error(err);
		});
	}
	const fetchPosts = async () => {
		await axios.get(`http://localhost:4000/api/post/getAllPostsofCommunity/${communityId}`).then((res) => {
			setPosts(res?.data?.posts);
		}).catch((err) => {
			toast.error(err);
		});
	}
	useEffect(() => {
		fetchCommunity();
		fetchPosts();
	}, []);

	const [closeModal, setCloseModal] = useState(false);

	const handleCloseModal = () => {
		setCloseModal(prev => !prev);
	}

	useEffect(() => {
		setUserData(JSON.parse(localStorage.getItem('userInfo')));
	}, []);

	const isMember = community?.members?.some((member) => (member?._id.toString() === userData?._id?.toString()));

	const totalPostImpressions = posts?.reduce((sum, currPost) => {
		return sum + currPost.impressions.length;
	}, 0);
	return (
		<>
			<Navbar3 />
			<div className='px-5 py-2 xl:px-50 flex gap-4 w-full bg-[#f5f2f7]'>
				{/* Left side */}
				<div className='w-[21%] sm:block sm:w-[23%] hidden py-5'>
				</div>

				{/* Middle Side */}
				<div className='w-full flex flex-col py-5 sm:w-[50%] '>
					{
						isMember && <>
							<Card padding={1}>
								<div className="flex flex-col gap-6">
									<div className="flex gap-2 w-full">
										<img className='w-11 h-11 rounded-4xl border border-gray-300' src={community?.logo} alt="profile-icon" />
										<div onClick={() => setCloseModal(true)} className='w-full px-3 py-3 border border-gray-300 rounded-3xl hover:bg-gray-200 cursor-pointer'>Start a post</div>
									</div>
								</div>
							</Card>
							<div className='border-b border-gray-400 w-full mb-4' />
						</>
					}

					<div className='w-full'>
						{
							posts?.map((item, index) => {
								return <Post item={item} index={index} key={item._id} fullHeight={0} />;
							})
						}
					</div>
				</div>

				{/* Right Side */}
				<div className='w-[26%] sm:hidden md:block py-5'>
					<div className='w-[78%] my-5 mx-15'>
						<div className='w-full flex justify-between bg-cyan-100 rounded-md py-6 px-5 border border-cyan-800'>
							<div className='text-cyan-800'>Post Impressions</div>
							<div className='text-cyan-800'>{totalPostImpressions}</div>
						</div>
					</div>
				</div>

				{closeModal &&
					<Modal closeModal={handleCloseModal}>
						<CommunityPostModal community={community} />
					</Modal>}
				{/* <Loader/> */}
				{/* We will show this when our api call is happening and until it is not completed, when api call is successful we will show the content*/}
				<ToastContainer />
			</div>
		</>
	)
}

export default CommunityPosts