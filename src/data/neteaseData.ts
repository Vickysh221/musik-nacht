import songs from './neteaseSongs.json'
import artists from './neteaseArtists.json'
import albums from './neteaseAlbums.json'
import neteaseEdges from './neteaseEdges'
import { events } from './musicMuseumMock'
import { agentRequestEdges, assignedAgents } from './agentAssignments'

export const edges = [...neteaseEdges, ...agentRequestEdges]
export const agents = assignedAgents
export { events }
export { songs, artists, albums }
