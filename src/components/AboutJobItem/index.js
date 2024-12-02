import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class AboutJobItem extends Component {
  state = {
    jobDataDetails: [],
    SimilarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }
  componentDidiMount() {
    this.getJobData()
  }
  getJobData = async props => {
    const {match} = this.props

    const {params} = match

    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`

    const optionsJobData = {
      headers: {Authorization: `Bearer ${jwtToken}`},

      method: 'GET',
    }

    const responseJobData = await fetch(jobDetailsApiUrl, optionsJobData)

    if (responseJobData.ok === true) {
      const fetchedJobData = await responseJobData.json()

      const updatedJobDetailsData = [fetchedJobData.job_details].map(
        eachItem({
          companyLogoUrl: eachItem.company_logo_url,
          companyWebsiteUrl: eachItem.company_website_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          lifeAtCompany: {
            description: eachItem.life_at_company.description,
            imageUrl: eachItem.image_url,
          },
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          rating: eachItem.rating,
          skills: eachItem.skills.map(each => ({
            imageUrl: each.image_url,
            name: each.name,
          })),
          title: eachItem.title,
        }),
      )
      const updatedSimilarJobDetails = fetchedJobData.similar_jobs.map(
        each => ({
          companyLogoUrl: each.company_logo_url,
          id: each.id,
          jobDescription: each.job_description,
          employmentType: each.employment_type,
          location: each.location,
          rating: each.rating,
          title: each.title,
        }),
      )
      this.setState({
        jobDataDetails: updatedJobDetailsData,
        SimilarJobsData: updatedSimilarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }
  renderJobsDetailsSuccessView = () => {
    const {jobDataDetails, SimilarJobsData} = this.state
    if (jobDataDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        id,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobDataDetails[0]
      return (
        <>
          <div>
            <div>
              <div>
                <img src={companyLogoUrl} alt="job details company logo" />
                <div>
                  <h1>{title}</h1>
                  <div>
                    <AiFillStar />
                    <p>{rating}</p>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div>
                    <MdLocationOn />
                    <p>{location}</p>
                  </div>
                  <div>
                    <p>{employmentType}</p>
                  </div>
                </div>
                <div>
                  <p>{packagePerAnnum}</p>
                </div>
              </div>
            </div>
            <div>
              <hr />
              <div>
                <div>
                  <h1>Description</h1>
                  <a href={companyWebsiteUrl}>
                    Visit <BiLinkExternal />
                  </a>
                </div>
                <p>{jobDescription}</p>
              </div>
              <h1>Skills</h1>
              <ul>
                {skills.map(each => (
                  <li key={each.name}>
                    <img src={each.imageUrl} alt={each.name} />
                    <p>{each.name}</p>
                  </li>
                ))}
              </ul>
              <div>
                <div>
                  <h1>Life at Company</h1>
                  <p>{lifeAtCompany.description}</p>
                </div>
                <img src={lifeAtCompany.imageUrl} alt="life at company" />
              </div>
            </div>
            <h1>Similar Jobs</h1>
            <ul>
              {SimilarJobsData.map(each => (
                <SimilarJobs
                  key={each.id}
                  similarJobsData={each}
                  employmentType={employmentType}
                />
              ))}
            </ul>
          </div>
        </>
      )
    }
    return null
  }
  onRetryJobDetailsAgain = () => {
    this.getJobData()
  }
  renderJobFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>OOps! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for</p>
      <div>
        <button type="button" onClick={this.onRetryJobDetailsAgain}>
          retry
        </button>
      </div>
    </div>
  )
  renderJobLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )
  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderJobLoadingView()
      default:
        return null
    }
  }
  render() {
    return (
      <>
        <Header />
        <div>{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default AboutJobItem
