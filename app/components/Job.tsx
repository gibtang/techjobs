import React from "react"
import { Link } from "blitz"
import { Box, Media, Content, Container } from "react-bulma-components"
import Modal from "react-modal"

// Components
import Logo from "./Logo"
import JobMeta from "./JobMeta"
import Share from "./Share"
import Like from "./Like"
import Apply from "./Apply"

// Change Modal default styles
Modal.defaultStyles.content.overflow = ""

const Job = (props) => {
  let { id, url, name, company, postedDate, type } = props.data
  const slug = name.replace(/[^A-Z0-9]+/gi, "-").toLowerCase()

  // Handle job age string
  let postedDays: number = 0
  if (postedDate) {
    const postedAge = new Date().getTime() - new Date(postedDate).getTime()
    postedDays = postedAge / 1000 / 60 / 60 / 24
  }
  return (
    <Box
      className={`job-box ${postedDays > 31 ? "old" : ""} ${type === "featured" ? "featured" : ""}`}
    >
      <Link href={`/?jobId=${id}`} as={`/jobs/${id}-${slug}`} scroll={false}>
        <div>
          <Media renderAs="article" className="is-hidden-mobile">
            <Media.Item position="left">
              <Logo job={props.data} />
            </Media.Item>
            <Media.Item>
              <Content>
                {type === "featured" && <div className="heading">featured</div>}
                <div>
                  <strong>{name}</strong> @ <small>{company && company.name}</small>
                </div>
                <JobMeta {...props} postedDays={postedDays} select={true} />
              </Content>
            </Media.Item>
            <Media.Item position="right">
              <Like id={id} />
              <Share id={id} slug={slug} />
              <Container>
                <Apply url={url} />
              </Container>
            </Media.Item>
          </Media>
          <div className="is-hidden-tablet" style={{ textAlign: "center" }}>
            <Logo job={props.data} style={{ margin: "0 auto" }} />
            <Content style={{ marginTop: 10 }}>
              {type === "featured" && <div className="heading">featured</div>}
              <div>
                <strong>{name}</strong> @ <small>{company && company.name}</small>
              </div>
              <JobMeta {...props} postedDays={postedDays} select={true} />
            </Content>
            <div className="mobile-actions">
              <Apply url={url} />
              <Like id={id} />
              <Share id={id} slug={slug} />
            </div>
          </div>
        </div>
      </Link>
      <style>{`
      .mobile-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      }
      .job-box {
        cursor: pointer;
        border: 2px solid transparent;
      }
      .job-box:hover {
        border: 2px solid gray;
        opacity: 1;
      }
      .job-box a {
        color: black;
      }
      .job-box.old {
        opacity: 0.6;
      }
      .job-box.featured {
        background: rgba(32, 156, 238,0.2);
      }
      
      `}</style>
    </Box>
  )
}

export default Job
