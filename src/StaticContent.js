/*
  @flow
  This JS object has all of the content of our static pages(about,careers, etc...)
*/

const StaticContent = {
  aboutUs: {
    title: "About us",

    topText: `Edu.Chat is an academic messaging platform focused on improving
              classroom communication  between professors, students and their
               peers.`,

    backgroudUrl: `/img/home/About.jpg`,

    bottomText: `The heart and the soul of Edu.Chat are the teachers and students that make up its community.
                Edu.Chat brings this academic community alive through our mobile and web based technology.
                Our platform is custom designed for each class and incorporates artificial intelligence
                 manifested as“teaching bots”
                that help professors better engage, challenge and strengthen the knowledge of their students.`
  },

  mission: {
    title: "Our Mission",

    backgroudUrl: `/img/home/Mission.jpg`,

    topText: `Our mission is to reimagine education in ways that are more collaborative
              and engaging.`,

    bottomText: `Our Mission at Edu.Chat is simply to make collaboration amongst
                faculty and students in the classroom richer and more engaging.
                The new world of higher education that we live in demands that we
                have a better way to connect our school environments in order to
                keep students excited about learning. We believe strongly that
                Edu.Chat will allow faculty to focus on the needs of each of their
                students better, enhance the interaction of the student body, and
                give students a powerful collaborative tool to excel as they pursue
                a life long journey of learning.`
  },

  team: {
    title: "Our Team",

    backgroudUrl: `/img/home/Team.jpg`,

    topText: `The family at Edu.Chat share the vision and values to reshape education.`,

    bottomText: `We’re driven by the idea that if we work hard to make a difference - we will.`,

    members: [
      {
        key: 0,
        name: "Ross Kopelman",
        title: "Co-Founder and CEO",
        photoUrl: "/img/team/ross.jpg"
      },
      {
        key: 1,
        name: "Jacob Niebloom",
        title: "Co-Founder, CTO, and Project Manager",
        photoUrl: "/img/team/jacob.jpg"
      },
      {
        key: 2,
        name: "Sarth Desai",
        title: "Co-Founder and Lead Designer",
        photoUrl: "/img/team/sarth.jpg"
      },
      {
        key: 3,
        name: "Lucas Daltro",
        title: "Frontend Manager",
        photoUrl: "/img/team/lucas.jpg"
      },
      {
        key: 4,
        name: "Luisa Hernandez",
        title: "Frontend Developer",
        photoUrl: "/img/team/luisa.jpg"
      },
      {
        key: 5,
        name: "Solomon Padilla",
        title: "Frontend Developer",
        photoUrl: "/img/team/solomon.jpg"
      },
      {
        key: 6,
        name: "Soyeon Park",
        title: "Frontend Developer",
        photoUrl: "/img/team/soyeon.jpg"
      },
      {
        key: 7,
        name: "Stephen Cohen",
        title: "Frontend Developer",
        photoUrl: "/img/team/stephen.jpg"
      },
      {
        key: 8,
        name: "Thomas Pinella",
        title: "Bot Manager",
        photoUrl: "/img/team/thomas.jpg"
      },
      {
        key: 9,
        name: "Da Wang",
        title: "Bot Developer",
        photoUrl: "/img/team/da.jpg"
      },
      {
        key: 10,
        name: "Justin Maldonado",
        title: "Bot & Frontend Developer",
        photoUrl: "/img/team/justin.jpg"
      },
      {
        key: 11,
        name: "Kiran Karpurapu",
        title: "Android Developer",
        photoUrl: "/img/team/kiran.jpg"
      },
      {
        key: 12,
        name: "Anand Ravikumar",
        title: "iOS Developer",
        photoUrl: "/img/team/anand.jpg"
      },
      {
        key: 13,
        name: "Asfandyar Sirhindi",
        title: "Backend Developer",
        photoUrl: "/img/team/asfan.jpg"
      },
      {
        key: 14,
        name: "Matias Alvial",
        title: "Designer",
        photoUrl: "/img/team/matias.jpg"
      },
      {
        key: 15,
        name: "Julian Wright",
        title: "Customer Engagement Manager",
        photoUrl: "/img/team/julian.jpg"
      },
      {
        key: 16,
        name: "Hayim Kim",
        title: "Community Manager",
        photoUrl: "/img/team/kim.jpg"
      },
      {
        key: 17,
        name: "Azfar Merchant",
        title: "Business Manager",
        photoUrl: "/img/team/azfar.jpg"
      }
    ]
  },

  press: {
    title: "Press",

    backgroudUrl: `/img/home/Press.jpg`,

    topText: `press@edu.chat`,

    bottomText: `We’d love the opportunity to hear from you. Our press team loves working with journalists around the world to share compelling,
                unique stories. If you’re a member of the media and would like to talk, please get in touch with the appropriate team or send an
                email to press@edu.chat.
                Only media inquiries will receive a response. If you’re an Edu.Chat faculty or student and have a question about the site,
                please visit: edu.chat/help">edu.chat/help`
  },

  careers: {
    title: "Work with us",

    backgroudUrl: `/img/home/Careers.jpg`,

    positions: [
      {
        key: 1,
        title: `Front-end Developer`,
        description: `<p>We are looking for candidates who are confortable with</p>
          Javascript, CSS3, and Html5.<p> React/Redux skills are a plus.</p>`,
        applyFormUrl: '#'
      },
      {
        key: 2,
        title: `Back-end Developer`,
        description: `Python, Django, PostgreSQL`,
        applyFormUrl: '#'
      },
      {
        key: 3,
        title: `iOS Developer`,
        description: `Swift and Objective-C`,
        applyFormUrl: '#'
      },
      {
        key: 4,
        title: `Android Developer`,
        description: `Java`,
        applyFormUrl: '#'
      },
      {
        key: 5,
        title: `Artificial Intelligence (Bot Developer)`,
        description: `Java and Spring Tool Suite™`,
        applyFormUrl: '#'
      },
      {
        key: 6,
        title: `Designer`,
        description: `Pencil (we can provide paper)`,
        applyFormUrl: '#'
      },
      {
        key: 7,
        title: `Communications`,
        description: ``,
        applyFormUrl: '#'
      },
      {
        key: 8,
        title: `Business`,
        description: ``,
        applyFormUrl: '#'
      }
    ],
  },
};

export default StaticContent;
