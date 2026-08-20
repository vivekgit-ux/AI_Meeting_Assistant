import { useState } from "react"
import axios from "axios"
import {
  LayoutDashboard,
  ListChecks,
  Settings,
  FileText,
} from "lucide-react"

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [recipient, setRecipient] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleProcessMeeting = async () => {
    if (!file) {
      alert("Please select a meeting audio file.")
      return
    }

    if (!recipient) {
      alert("Please enter a recipient email.")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post(
        `http://localhost:8000/process-meeting?recipient=${encodeURIComponent(
          recipient
        )}`,
        formData
      )

      setResult(response.data)

      console.log("Meeting processed:", response.data)

      alert("Meeting processed successfully!")
    } catch (error) {
      console.error("Processing failed:", error)
      alert("Failed to process the meeting.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-5">
        <div className="mb-10">
          <h1 className="text-xl font-bold">
            AI Meeting Assistant
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Smart meeting workspace
          </p>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 rounded-lg bg-slate-800 px-4 py-3 text-left">
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white">
            <FileText size={20} />
            Meetings
          </button>

          <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white">
            <ListChecks size={20} />
            Action Items
          </button>

          <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white">
            <Settings size={20} />
            Settings
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="mt-2 text-slate-400">
            Upload a meeting recording and let AI handle the rest.
          </p>

          {/* Meeting Processing Card */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-xl font-semibold">
              Process a meeting
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Upload an audio recording and generate the transcript,
              summary, action items, decisions, and follow-up email.
            </p>

            {/* Audio Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Meeting audio
              </label>

              <input
                type="file"
                accept="audio/*"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null)
                }}
                className="block w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
              />

              {file && (
                <p className="mt-2 text-sm text-slate-400">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Recipient Email */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">
                Recipient email
              </label>

              <input
                type="email"
                value={recipient}
                onChange={(event) =>
                  setRecipient(event.target.value)
                }
                placeholder="team@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Process Button */}
            <button
              onClick={handleProcessMeeting}
              disabled={loading}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Process Meeting"}
            </button>

            {/* Results */}
            {result && (
              <div className="mt-8 space-y-6">

                {/* Summary */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                  <h3 className="text-lg font-semibold">
                    Meeting Summary
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap text-slate-300">
                    {result.summary}
                  </p>
                </div>

                {/* Transcript */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                  <h3 className="text-lg font-semibold">
                    Transcript
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap text-slate-300">
                    {result.transcript}
                  </p>
                </div>

                {/* Action Items */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                  <h3 className="text-lg font-semibold">
                    Action Items
                  </h3>

                  {result.action_items?.items?.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {result.action_items.items.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                          >
                            <p className="text-slate-200">
                              {typeof item === "string"
                                ? item
                                : JSON.stringify(item)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-slate-400">
                      No action items were identified.
                    </p>
                  )}
                </div>

                {/* Decisions */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                  <h3 className="text-lg font-semibold">
                    Decisions
                  </h3>

                  {result.decisions?.decisions?.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {result.decisions.decisions.map(
                        (decision: any, index: number) => (
                          <div
                            key={index}
                            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                          >
                            <p className="text-slate-200">
                              {typeof decision === "string"
                                ? decision
                                : JSON.stringify(decision)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-slate-400">
                      No decisions were identified.
                    </p>
                  )}
                </div>

                {/* Follow-up Email */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                  <h3 className="text-lg font-semibold">
                    Follow-up Email
                  </h3>

                  <p className="mt-3 font-medium text-white">
                    {result.followup_email?.subject}
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-slate-300">
                    {result.followup_email?.body}
                  </p>

                  {result.email_sent && (
                    <p className="mt-4 text-sm text-green-400">
                      ✓ Email sent successfully
                    </p>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App