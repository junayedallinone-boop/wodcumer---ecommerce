import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Close, Play } from './Icons'
import { ease } from './Motion'

const VideoContext = createContext(null)

// Some clips have a lead-in we don't want (`start` seconds): skip it on load and when looping
const trimmed = (start) =>
  start
    ? {
        onLoadedMetadata: (e) => (e.currentTarget.currentTime = start),
        onTimeUpdate: (e) => e.currentTarget.currentTime < start - 0.25 && (e.currentTarget.currentTime = start),
      }
    : {}

// Full-screen player shared by every play button. Falls back to the poster if the video file is missing.
export function VideoProvider({ children }) {
  const [current, setCurrent] = useState(null)
  const [failed, setFailed] = useState(false)

  const open = useCallback((video) => {
    setFailed(false)
    setCurrent(video)
  }, [])
  const close = useCallback(() => setCurrent(null), [])

  useEffect(() => {
    if (!current) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [current, close])

  return (
    <VideoContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
          >
            <motion.div
              className="relative flex max-h-full max-w-[min(1100px,100%)] items-center justify-center overflow-hidden bg-black shadow-2xl"
              initial={{ scale: 0.88, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ duration: 0.55, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              {failed ? (
                <div className="relative">
                  <img src={current.poster} alt="" className="max-h-[85vh] w-auto object-contain opacity-60" />
                  <p className="absolute inset-0 flex items-center justify-center font-serif text-2xl italic text-bg md:text-4xl">Video coming soon</p>
                </div>
              ) : (
                <video
                  key={current.src}
                  src={current.start ? `${current.src}#t=${current.start}` : current.src}
                  poster={current.poster}
                  className="max-h-[85vh] w-auto"
                  controls
                  autoPlay
                  playsInline
                  onError={() => setFailed(true)}
                  {...trimmed(current.start)}
                />
              )}
            </motion.div>
            <button
              aria-label="Close video"
              onClick={close}
              className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-bg text-ink transition-transform duration-500 ease-smooth hover:rotate-90 md:right-8 md:top-8"
            >
              <Close />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </VideoContext.Provider>
  )
}

export const useVideo = () => useContext(VideoContext)

export function PlayButton({ large = false, onClick }) {
  return (
    <button
      aria-label="Play video"
      onClick={onClick}
      className={`relative z-10 flex items-center justify-center rounded-full text-white backdrop-blur-[5px] transition-all duration-500 ease-smooth hover:scale-110 ${
        large ? 'bg-white/15 p-6 hover:bg-white/30' : 'bg-ink/25 p-4 hover:bg-ink/45'
      }`}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-white/20 [animation-duration:2.4s]" />
      <Play className={large ? 'size-8' : 'size-6'} />
    </button>
  )
}

// Poster image that swaps to a silent looping preview on hover (or always, with `autoPlay`).
// Clicking anywhere opens the full player.
export function VideoTile({ video, className = '', autoPlay = false, large = false, playButton = true, children }) {
  const open = useVideo()
  const ref = useRef(null)
  const [ready, setReady] = useState(false)
  const [missing, setMissing] = useState(false)

  const play = () => !missing && ref.current?.play().catch(() => {})
  const stop = () => {
    if (autoPlay || !ref.current) return
    ref.current.pause()
    ref.current.currentTime = video.start ?? 0
  }

  return (
    <div
      className={`group relative flex cursor-pointer items-center justify-center overflow-hidden ${className}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      onClick={() => open(video)}
    >
      <img
        src={video.poster}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-105"
      />
      {!missing && (
        <video
          ref={ref}
          src={video.src}
          muted
          loop
          playsInline
          autoPlay={autoPlay}
          preload={autoPlay ? 'auto' : 'metadata'}
          {...trimmed(video.start)}
          onPlaying={() => setReady(true)}
          onError={() => setMissing(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
            !ready ? 'opacity-0' : autoPlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        />
      )}
      {children}
      {/* On cards the button steps aside while the hover preview plays */}
      {playButton && (
        <span
          className={`relative z-10 transition-all duration-500 ease-smooth ${
            autoPlay ? '' : 'group-hover:pointer-events-none group-hover:scale-75 group-hover:opacity-0'
          }`}
        >
          <PlayButton large={large} />
        </span>
      )}
    </div>
  )
}
