import { Suspense, useEffect } from "react"
import { useQuery, Link } from "blitz"
import ErrorBoundary from "app/components/ErrorBoundary"
import getJob from "../jobs/queries/getJob"
import { FiExternalLink, FiArrowRight } from "react-icons/fi"
import { MdClose } from "react-icons/md"
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs"
import { IconContext } from "react-icons"
import { Content, Level, Heading, Button, Columns, Loader } from "react-bulma-components"
import { ContentBox, A, MobileActions, LevelItem } from "../styles/common"
import Share from "../components/Share"
import Like from "../components/Like"
import Apply from "../components/Apply"
import JobMeta from "../components/JobMeta"
import Logo from "./Logo"
import incrementJob from "app/jobs/mutations/incrementJob"

const Job = ({ id }) => {
  // Get the ID in integer
  // Parse int strips from the first non-number
  id = parseInt(id)
  const [job] = useQuery(getJob, {
    where: {
      id,
    },
    include: {
      company: true,
      tags: true,
    },
  })

  useEffect(() => {
    incrementJob({ key: "views", id })
  }, [])

  const { name, company, description, postedDate, url } = job
  const slug = name.replace(/[^A-Z0-9]+/gi, "-").toLowerCase()

  // Handle job age string
  let postedDays = 0
  if (postedDate) {
    const postedAge = new Date().getTime() - new Date(postedDate).getTime()
    postedDays = Math.round(postedAge / 1000 / 60 / 60 / 24)
  }

  return (
    <>
      <div style={{ textAlign: "right" }} className="is-hidden-tablet">
        <Link href="/" as="/" scroll={false}>
          <a>
            <MdClose size={30} color="black" />
          </a>
        </Link>
      </div>
      <Level>
        <Level.Side align="left" className="job-name">
          <LevelItem>
            <Logo job={job} />
          </LevelItem>
          <LevelItem style={{ flexShrink: 1 }}>
            <Content>
              <Heading size={4} style={{ wordBreak: "break-word" }}>
                {name}
              </Heading>
              <p>{company.name}</p>
            </Content>
          </LevelItem>
        </Level.Side>
        <Level.Side align="right" className="is-hidden-mobile">
          <LevelItem>
            <Share id={id} slug={slug} />
          </LevelItem>
          <LevelItem>
            <Like id={id} />
          </LevelItem>
          <LevelItem>
            <Apply url={url} />
          </LevelItem>
          <LevelItem className="is-hidden-mobile">
            <Link href="/" as="/" scroll={false}>
              <a>
                <MdClose size={30} color="black" />
              </a>
            </Link>
          </LevelItem>
        </Level.Side>
        <MobileActions className="is-hidden-tablet">
          <Apply url={url} />
          <Like id={id} />
          <Share id={id} slug={slug} />
        </MobileActions>
      </Level>
      <Columns>
        <Columns.Column size={6}>
          <Heading size="6">About the job</Heading>
          <ContentBox>
            <JobMeta postedDays={postedDays} data={job} />
            <hr />
            <Content size="small" dangerouslySetInnerHTML={{ __html: description }}></Content>
            <a href={url} target="_blank">
              <Button size="small" color="info" outlined={true}>
                Read more <FiArrowRight />
              </Button>
            </a>
          </ContentBox>
        </Columns.Column>
        <Columns.Column size={6}>
          <Heading size={6}>About the company</Heading>
          <ContentBox>
            <Content>{company.about}</Content>
            {company.url && (
              <Content>
                <A href={company.url}>
                  <Heading size="6" as="h6">
                    {company.url}
                    <FiExternalLink size="15px" style={{ marginLeft: 5 }} />
                  </Heading>
                </A>
              </Content>
            )}
            {company.gdUrl && company.gdRating && (
              <Level>
                <Level.Side align="left">
                  <LevelItem>
                    <IconContext.Provider value={{ size: "25px", color: "#0CAA41" }}>
                      {[...Array(parseInt(company.gdRating))].map((e, i) => (
                        <BsStarFill key={i} />
                      ))}
                      {parseFloat(company.gdRating) - parseInt(company.gdRating) > 0 ? <BsStarHalf /> : <></>}
                      {[...Array(5 - Math.ceil(parseFloat(company.gdRating)))].map((e, i) => (
                        <BsStar key={i} />
                      ))}
                    </IconContext.Provider>
                  </LevelItem>
                  <LevelItem>
                    <Heading subtitle size={6} renderAs="h6">
                      rating on
                    </Heading>
                    <A href={company.gdUrl} target="_blank">
                      <img
                        src="../glassdoor.png"
                        alt="Glassdoor logo"
                        style={{ width: 100, margin: "0 10px" }}
                      />
                      <FiExternalLink size="15px" style={{ verticalAlign: "middle" }} />
                    </A>
                  </LevelItem>
                </Level.Side>
              </Level>
            )}
            {company.liUrl && company.liEmpCount && (
              <Level>
                <Level.Side align="left">
                  <LevelItem>
                    <Heading>{company.liEmpCount}</Heading>
                  </LevelItem>
                  <LevelItem>
                    <Heading subtitle size={6} renderAs="h6">
                      employees on
                    </Heading>
                    <A href={company.liUrl} target="_blank">
                      <img
                        src="../linkedin.png"
                        alt="LinkedIn logo"
                        style={{ width: 100, margin: "0 10px" }}
                      />
                      <FiExternalLink size="15px" style={{ verticalAlign: "middle" }} />
                    </A>
                  </LevelItem>
                </Level.Side>
              </Level>
            )}
          </ContentBox>
        </Columns.Column>
        <Level className="is-hidden-tablet">
          <LevelItem>
            <Link href="/" as="/" scroll={false}>
              <Button renderAs="a" color="info" size="small" outlined={true}>
                Close
              </Button>
            </Link>
          </LevelItem>
        </Level>
      </Columns>
      <style jsx global>
        {`
          @media screen and (min-width: 768px) {
            .job-name {
              max-width: calc(100% - 215px);
            }
          }
        `}
      </style>
    </>
  )
}

const JobContent = (props) => {
  return (
    <ErrorBoundary fallback={(error) => <div>Error: {JSON.stringify(error)}</div>}>
      <Suspense
        fallback={
          <LevelItem>
            <Loader style={{ width: 100, height: 100, marginTop: 100 }} />
          </LevelItem>
        }
      >
        <Job {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}

export default JobContent
