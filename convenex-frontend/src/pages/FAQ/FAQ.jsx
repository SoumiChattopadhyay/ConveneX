import React from 'react'
import Navbar3 from '../../components/NavbarV3/Navbar3'

const FAQ = () => {
    const faqs=[{question:"What is this community about?",answer:"This community is a collaborative space designed to bring together individuals with shared interests, goals, and passions where members can participate in discussions, events, workshops, projects, networking activities, and knowledge-sharing sessions to learn, connect, and grow together in a supportive environment."},
        {question:"Who can join the community?",answer:"Anyone interested in the community’s focus area is welcome to join whether they are beginners, students, professionals, creators, or enthusiasts looking to learn, collaborate, network, and grow alongside like-minded individuals."},
        {question:"What kind of activities are organized?",answer:"The community regularly organizes workshops, webinars, networking sessions, collaborative projects, mentorship programs, discussions, competitions, and interactive meetups designed to help members gain skills, practical experience, and meaningful connections."},
        {question:"Are the events free to attend?",answer:"Most community events are free and accessible to all registered members, although certain premium workshops, competitions, or specialized programs may include a small registration fee depending on resources, certifications, prizes, or guest speakers."},
        {question:"Can beginners participate in the community?",answer:"Absolutely, the community is beginner-friendly and encourages members at all experience levels to learn, ask questions, collaborate, participate in activities, and build confidence through guidance, projects, and peer support."},
        {question:"How can I participate in events and projects?",answer:"Members can explore upcoming events, workshops, and collaborative projects through the platform and register to participate individually or with teams while contributing ideas, skills, discussions, and project work."},
        {question:"What are the benefits of joining the community?",answer:"By joining the community, members gain access to networking opportunities, collaborative projects, workshops, mentorship, discussions, learning resources, events, and a supportive ecosystem that helps them grow personally and professionally."},
        {question:"How can I contact the organizers?",answer:"You can contact the organizers through the Contact section available on the platform or through the official communication channels listed on the community page for support, collaborations, event queries, partnerships, and community-related assistance."}
    ];

    return (
        <>
            <Navbar3 />
            <div className='bg-[#f5f2f7] p-5 w-full relative'>
                <div className='text-3xl text-center font-semibold bg-[#f5f2f7]'>FAQs</div>
                <div className='p-15'>
                    {faqs.map((faq, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="font-semibold">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default FAQ