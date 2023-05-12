import React from 'react'
import "./HomePage.css"
import loremContent from './LoremPosts'

const HomePage = () => {
  return (
    <div id="home" className='md:px-5 px-2'>
      <h1 className='flex-row pb-5 text-3xl'>Blogs</h1>
      {loremContent.map((content,index) => (
        <div key={`blog-${index}`} className="blog-box hover:bg-slate-100 hover:drop-shadow-md ">
          <p className="date">{content.date}</p>
          <h4 className='title'>{content.title}</h4>
          <p className="content">{content.content}</p>
        </div>
      ))}
      
    </div>
  )
}

export default HomePage