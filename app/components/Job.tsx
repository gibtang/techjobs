import React, { useState } from "react"
import { Box, Media, Content, Tag, Icon, Level, Heading, Container, Button } from "react-bulma-components"
import { FcLikePlaceholder, FcLike } from "react-icons/fc"
import { RiShareLine } from "react-icons/ri"
import { FaRegMoneyBillAlt } from "react-icons/fa"
import { MdDateRange, MdClose } from "react-icons/md"
import Modal from "react-modal"
import styled from "styled-components"
import Tags from "./Tags"

const LOGO_PATHS = {
  Adzuna: "/Adzuna-logo.svg",
  eFinancialCareers: "/eFinancialCareers-logo.svg",
  "eFinancial Careers": "/eFinancialCareers-logo.svg",
  "Tech In Asia": "/TechInAsia-logo.svg",
  "Stack Overflow": "/StackOverflow-logo.svg",
  "Zoho Recruit": "/ZohoRecruit-logo.png",
  eQuest: "/eQuest-logo.png",
  Hirebridge: "/Hirebridge-logo.png",
}

const JobBox = styled(Box)`
  cursor: pointer;
  border: 2px solid transparent;
  :hover {
    border: 2px solid gray;
    opacity: 1;
  }
  ${(props) => (props.old ? "opacity: 0.6;" : "")}
`

const IconSlot = styled(Icon)`
  margin-left: 10px;
`

const Placeholder = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  border-radius: 10px;
  background: aliceblue;
  font-weight: 700;
`

const Source = styled.img`
  max-height: 16px;
  margin-left: 5px;
`

const Job = (props) => {
  const { selectedTags, setSelectedTags } = props
  const { id, avatar, name, company, salary, tags, postedDate, description, source, url } = props.data
  const [showModal, setShowModal] = useState(false)

  const closeModal = () => {
    setShowModal(false)
  }

  const clickLike = (e) => {
    e.stopPropagation()
    props.setLiked((prevLiked) => {
      if (prevLiked.includes(id)) return prevLiked.filter((l) => l !== id)
      return [...prevLiked, id]
    })
  }

  // Handle job age string
  let postedAgeStr = ""
  let postedDays = 0
  if (postedDate) {
    const postedAge = new Date().getTime() - new Date(postedDate).getTime()
    postedDays = Math.round(postedAge / 1000 / 60 / 60 / 24)
    if (postedDays < 1) {
      const postedHours = Math.round(postedAge / 1000 / 60 / 60)
      postedAgeStr = `${postedHours || "< 1"} hour${postedHours > 1 ? "s" : ""} ago`
    } else {
      postedAgeStr = `${postedDays} day${postedDays > 1 ? "s" : ""} ago`
    }
  }
  return (
    <JobBox old={postedDays > 31 ? 1 : 0}>
      <Media renderAs="article" onClick={() => setShowModal(true)}>
        <Media.Item position="left">
          <figure className="image is-64x64">
            {avatar || (company && company.imgUrl && company.imgUrl !== "https://") ? (
              <img src={avatar || (company && company.imgUrl)} alt="Company logo" />
            ) : (
              <Placeholder>{company ? company.name.slice(0, 1) : name.slice(0, 1)}</Placeholder>
            )}
          </figure>
        </Media.Item>
        <Media.Item>
          <Content>
            <div>
              <strong>{name}</strong> @ <small>{company && company.name}</small>
              <br />
              {description}
            </div>
            <Level style={{ margin: "0.5em 0", fontSize: "0.8em" }}>
              <Level.Side align="left">
                {salary && (
                  <Level.Item>
                    <FaRegMoneyBillAlt size="1.5em" style={{ marginRight: 5 }} /> {salary}
                  </Level.Item>
                )}
                <Level.Item style={{ color: postedDays > 31 ? "#e74c3c" : "black" }}>
                  <MdDateRange size="1.5em" style={{ marginRight: 5 }} /> {postedAgeStr}
                </Level.Item>
                <Level.Item>
                  {source && LOGO_PATHS[source.split(",")[0]] && (
                    <>
                      by <Source src={LOGO_PATHS[source.split(",")[0]]} />
                    </>
                  )}
                </Level.Item>
                <Level.Item>
                  {source && source.includes(",") && (
                    <>
                      via <Source src={LOGO_PATHS[source.split(",")[1]]} />
                    </>
                  )}
                </Level.Item>
              </Level.Side>
            </Level>
            {tags && <Tags {...{ tags: tags.map((t) => t.name), selectedTags, setSelectedTags }} />}
          </Content>
        </Media.Item>
        <Media.Item position="right">
          <IconSlot onClick={clickLike} title="Like">
            {props.liked.includes(id) ? <FcLike size="2em" /> : <FcLikePlaceholder size="2em" />}
          </IconSlot>
          <IconSlot title="Share">
            <RiShareLine size="2em" />
          </IconSlot>
          <Container>
            <Button
              renderAs="a"
              color="info"
              outlined={true}
              rounded={true}
              style={{ borderWidth: 2, fontWeight: 600 }}
              href={url}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              Apply
            </Button>
          </Container>
        </Media.Item>
      </Media>
      <Modal isOpen={showModal} onRequestClose={closeModal}>
        <Container>
          <Level>
            <Level.Side align="left">
              <figure className="image is-64x64">
                <img src={avatar} alt="Company logo" />
              </figure>
              <Heading>{name}</Heading>
            </Level.Side>
            <Level.Side align="right">
              <MdClose onClick={closeModal} />
            </Level.Side>
          </Level>
        </Container>
      </Modal>
      <style jsx global>{`
        .ReactModal__Overlay.ReactModal__Overlay--after-open {
          z-index: 99;
        }
      `}</style>
    </JobBox>
  )
}

export default Job
