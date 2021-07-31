import { useState, useContext, useCallback, useEffect } from 'react'
import Loader from '../components/Loader'
import LinksList from '../components/LinksList'
import { AuthContext } from '../context/authContext'
import { useHttp } from '../hooks/http.hook'

export default function LinksPage() {
  const { loading, request } = useHttp()
  const { token } = useContext(AuthContext)
  const [links, setLinks] = useState([])

  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request('/api/link', 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setLinks(fetched)
    } catch (error) {}
  }, [token, request])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  if (loading) {
    return <Loader />
  }

  return <>{!loading && <LinksList links={links} />}</>
}
