import { useState } from "react"
import axios from "axios"
import {
  LayoutDashboard,
  ListChecks,
  Settings,
  FileText,
  CheckCircle2,
  Upload,
  Mail,
  Brain,
  ClipboardList,
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
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 p-5 md:block">

        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Brain size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                AI Meeting Assistant
              </h1>

              <p className="text-xs text-slate-400">
                Smart meeting workspace
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">

          <button className="flex w-full items-center gap-3 rounded-lg bg-blue-600/10 px-4 py-3 text-left text-blue-400">
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <FileText size={20} />
            Meetings
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <ListChecks size={20} />
            Action Items
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <Settings size={20} />
            Settings
          </button>

        </nav>

      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8">

        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-blue-400">
                AI MEETING WORKSPACE
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Meeting Dashboard
              </h2>

              <p className="mt-2 max-w-2xl text-slate-400">
                Turn meeting recordings into structured insights and
                follow-up emails.
              </p>
            </div>

            <div className="hidden items-center rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 md:flex">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400" />
              System Ready
            </div>

          </div>

          {/* Processing Card */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                <Upload size={24} />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Process a meeting
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Upload an audio recording and generate the transcript,
                  summary, action items, decisions, and follow-up email.
                </p>
              </div>

            </div>

            {/* Audio Upload */}
            <div className="mt-7">

              <label className="mb-2 block text-sm font-medium">
                Meeting audio
              </label>

              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-5">

                <input
                  type="file"
                  accept="audio/*"
                  onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null)
                  }}
                  className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-blue-500"
                />

                {file && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2
                      size={16}
                      className="text-green-400"
                    />
                    Selected: {file.name}
                  </div>
                )}

              </div>

            </div>

            {/* Recipient */}
            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium">
                Recipient email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  value={recipient}
                  onChange={(event) =>
                    setRecipient(event.target.value)
                  }
                  placeholder="team@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Process Button */}
            <button
              onClick={handleProcessMeeting}
              disabled={loading}
              className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain size={18} />
                  Process Meeting
                </>
              )}
            </button>

            {/* Results */}
            {result && (
              <div className="mt-10 space-y-6">

                {/* Result Header */}
                <div className="border-b border-slate-800 pb-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                      <CheckCircle2 size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        Meeting processed successfully
                      </h3>

                      <p className="text-sm text-slate-400">
                        {result.filename}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Summary */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <Brain size={18} />
                    </div>

                    <h3 className="text-lg font-semibold">
                      Meeting Summary
                    </h3>

                  </div>

                  <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">
                    {result.summary}
                  </p>

                </div>

                {/* Transcript */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                      <FileText size={18} />
                    </div>

                    <h3 className="text-lg font-semibold">
                      Transcript
                    </h3>

                  </div>

                  <div className="mt-4 max-h-80 overflow-y-auto rounded-lg bg-slate-900 p-4">

                    <p className="whitespace-pre-wrap leading-7 text-slate-300">
                      {result.transcript}
                    </p>

                  </div>

                </div>

                {/* Action Items */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
                      <ClipboardList size={18} />
                    </div>

                    <h3 className="text-lg font-semibold">
                      Action Items
                    </h3>

                  </div>

                  {result.action_items?.items?.length > 0 ? (

                    <div className="mt-4 space-y-3">

                      {result.action_items.items.map(
                        (item: any, index: number) => (

                          <div
                            key={index}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                          >

                            <div className="flex gap-3">

                              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">
                                <CheckCircle2 size={14} />
                              </div>

                              <p className="text-slate-200">
                                {typeof item === "string"
                                  ? item
                                  : JSON.stringify(item)}
                              </p>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="mt-4 rounded-xl bg-slate-900 p-4">

                      <p className="text-sm text-slate-400">
                        No action items were identified.
                      </p>

                    </div>

                  )}

                </div>

                {/* Decisions */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                      <CheckCircle2 size={18} />
                    </div>

                    <h3 className="text-lg font-semibold">
                      Decisions
                    </h3>

                  </div>

                  {result.decisions?.decisions?.length > 0 ? (

                    <div className="mt-4 space-y-3">

                      {result.decisions.decisions.map(
                        (decision: any, index: number) => (

                          <div
                            key={index}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-4"
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

                    <div className="mt-4 rounded-xl bg-slate-900 p-4">

                      <p className="text-sm text-slate-400">
                        No decisions were identified.
                      </p>

                    </div>

                  )}

                </div>

                {/* Follow-up Email */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <Mail size={18} />
                    </div>

                    <h3 className="text-lg font-semibold">
                      Follow-up Email
                    </h3>

                  </div>

                  <div className="mt-4 rounded-xl bg-slate-900 p-5">

                    <p className="font-semibold text-white">
                      {result.followup_email?.subject}
                    </p>

                    <div className="my-4 border-t border-slate-800" />

                    <p className="whitespace-pre-wrap leading-7 text-slate-300">
                      {result.followup_email?.body}
                    </p>

                  </div>

                  {result.email_sent && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle2 size={16} />
                      Email sent successfully
                    </div>
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