import { useCallback, useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { AuthContext } from '../context/authContext'
import { useHttp } from '../hooks/http.hook'
import Loader from '../components/Loader'
import LinkCard from '../components/LinkCard'

export default function DeatailPage() {
  const { token } = useContext(AuthContext)
  const { request, loading } = useHttp()
  const [link, setLink] = useState(null)
  const linkId = useParams().id

  const getLink = useCallback(async () => {
    try {
      const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setLink(fetched)
    } catch (error) {}
  }, [token, request, linkId])

  useEffect(() => {
    getLink()
  }, [getLink])

  if (loading) {
    return <Loader />
  }

  return <>{!loading && link && <LinkCard link={link} />}</>
}
