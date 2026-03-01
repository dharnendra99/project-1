import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { siteSettings as fallbackSettings } from '../data/siteSettings'
import { skills as fallbackSkills } from '../data/skills'
import { experience as fallbackExperience } from '../data/experience'

export function useSiteData() {
    const [settings, setSettings] = useState({
        name: fallbackSettings.name,
        tagline: fallbackSettings.tagline,
        bio: fallbackSettings.bio,
        email: fallbackSettings.email,
        location: fallbackSettings.location,
        availability: fallbackSettings.availability,
        resume_url: fallbackSettings.resume_url,
        profile_photo_url: fallbackSettings.profile_photo_url,
        social: fallbackSettings.social,
        funFacts: fallbackSettings.funFacts
    })
    const [skills, setSkills] = useState(fallbackSkills)
    const [experience, setExperience] = useState(fallbackExperience)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const fetchData = async () => {
            if (!import.meta.env.VITE_SUPABASE_URL) {
                setLoading(false)
                return
            }

            try {
                // Fetch Settings
                const { data: settingsData } = await supabase.from('site_settings').select('*')
                if (settingsData && settingsData.length > 0 && mounted) {
                    const mapped = {}
                    settingsData.forEach(row => { mapped[row.key] = row.value })

                    setSettings(prev => ({
                        ...prev,
                        name: mapped.name || prev.name,
                        tagline: mapped.tagline || prev.tagline,
                        bio: mapped.bio || prev.bio,
                        email: mapped.email || prev.email,
                        location: mapped.location || prev.location,
                        availability: mapped.availability || prev.availability,
                        resume_url: mapped.resume_url || prev.resume_url,
                        profile_photo_url: mapped.profile_photo_url || prev.profile_photo_url,
                        social: {
                            github: mapped.github || prev.social.github,
                            linkedin: mapped.linkedin || prev.social.linkedin,
                            twitter: mapped.twitter || prev.social.twitter,
                            dribbble: mapped.dribbble || prev.social.dribbble,
                        }
                    }))
                }

                // Fetch Skills
                const { data: skillsData } = await supabase.from('skills').select('*').order('order_index')
                if (skillsData && skillsData.length > 0 && mounted) {
                    setSkills(skillsData)
                }

                // Fetch Experience
                const { data: expData } = await supabase.from('experience').select('*').order('order_index')
                if (expData && expData.length > 0 && mounted) {
                    setExperience(expData)
                }

            } catch (error) {
                console.error('Error fetching site data:', error)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchData()

        return () => {
            mounted = false
        }
    }, [])

    return { settings, skills, experience, loading }
}
