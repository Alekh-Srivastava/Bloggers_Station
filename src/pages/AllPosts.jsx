import React,{ useState,useEffect } from 'react'
import { Container,PostCard } from '../index'
import appwriteService from "../appWrite/configure"
import { Query } from 'appwrite'
import { useSelector } from 'react-redux'


function AllPosts() {
    const [posts,setPosts] = useState([])
    const userId = useSelector((state)=>(state.auth.userData))?.$id
    // console.log(userId.$id);
    
    useEffect(()=>{
        appwriteService.getPosts([Query.equal('userId',userId)]).then((post) => {
            if (post) {
                setPosts(post.documents)
            }
        })
    },[])
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts