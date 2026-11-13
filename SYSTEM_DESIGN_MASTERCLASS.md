# 🏛️ Complete System Design Masterclass (1–5 Years SDE-1 to SDE-2 / L5 Experience)

> **The Definitive Practical & Theoretical Guide for Junior to Senior Software Engineers**  
> *हिंदी और हिंग्लिश में — वास्तविक आर्किटेक्चर, ट्रेड-ऑफ्स, समीकरण, और इस HyperScale SaaS प्रोजेक्ट के संदर्भ के साथ।*

---

## 📊 1 से 5 साल के अनुभव स्तर के अनुसार संपूर्ण रोडमैप (Experience Level Breakdown Chart)

| अनुभव स्तर (Experience Level) | इंटरव्यूअर क्या पूछता है? (Key Focus Areas) | क्या इस फ़ाइल और प्रोजेक्ट में शामिल है? (Coverage & Proof) |
|---|---|---|
| **1-2 Years (SDE-1 / Junior)** | • REST APIs & HTTP Status Codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Too Many Requests`, `500 Internal Error`)<br>• MongoDB CRUD, Mongoose Schemas, Compound Indexes (`category_1_status_1`)<br>• JWT Authentication (Access Token, Bearer Headers, और Logout)<br>• Node.js Non-Blocking Event Loop, Callbacks, Promises, Async/Await<br>• Git, Dockerfile, और Environment Variables (`.env`) | ✅ **हाँ, 100% शामिल है**<br>(मॉड्यूल 1, मॉड्यूल 6, और `backend/src/models/` व `controllers/` में लाइव लागू) |
| **2-3 Years (Mid-Level SDE)** | • **Redis Caching**: Cache Hit vs Cache Miss, Cache-Aside Pattern, TTL, Cache Invalidation on Update/Delete<br>• **WebSockets vs HTTP Polling**: Socket.io Rooms, Bi-directional TCP Stream, Real-time Events<br>• **Asynchronous Background Jobs**: BullMQ / Redis Queues, Heavy CPU work offloading, Exponential Backoff Retries<br>• DB Relationships, Mongoose `.populate()`, Connection Pooling (`maxPoolSize: 20`)<br>• Microservices कम्युनिकेशन के बेसिक्स और API Gateway Patterns | ✅ **हाँ, 100% शामिल है**<br>(मॉड्यूल 2, मॉड्यूल 3, और लाइव `Dashboard`, `FlashSaleTimer`, व `queue.js` में लागू) |
| **3-4 Years (SDE-2 / Senior)** | • **Rate Limiting Deep Dive**: Sliding Window Log (Redis `ZSET`) vs Token Bucket vs Fixed Window Boundary Spikes<br>• **Message Brokers**: RabbitMQ Direct Exchanges, Durable Queues, Message Acknowledgment (`ACK`/`NACK`), Dead Letter Queues (DLQ)<br>• **Concurrency & Race Conditions**: Pessimistic (`SELECT FOR UPDATE`) vs Optimistic (`version++`) vs Redis In-Memory Atomic Decrement (`DECR`)<br>• Message Delivery Semantics: At-least-once, Exactly-once via Idempotency Keys<br>• Webhook Security: HMAC SHA-256 Signatures, Replay Attacks, Nonce, Raw Body Hashing | ✅ **हाँ, 100% शामिल है**<br>(मॉड्यूल 3, 5, 6, और `flashSale.controller.js` व `payment.controller.js` में लाइव लागू) |
| **4-5 Years (Senior / L5 / Lead)** | • **CAP vs PACELC Theorem**: Latency vs Consistency ट्रेड-ऑफ्स (PC/EC vs PA/EL)<br>• **Consistent Hashing & Virtual Nodes**: हैश रिंग, हॉटस्पॉट मिटिगेशन, री-हैशिंग अवॉइडेंस<br>• **Cache Stampede (Dogpiling / Thundering Herd)**: Mutex Locks (`SETNX`) और XFetch Probabilistic Early Expiration<br>• **Database Internals**: B-Tree (Random I/O) vs LSM-Tree (Sequential Append WAL + SSTables)<br>• **Database Sharding & Replication Topologies**: Single-Leader, Multi-Leader, Leaderless ($W + R > N$ Quorum Reads/Writes), Replication Lag Mitigation<br>• **Resilience Engineering**: Netflix Hystrix Circuit Breaker (CLOSED, OPEN, HALF-OPEN), Bulkheads, Saga Pattern (Orchestration vs Choreography)<br>• **Kubernetes Architecture**: Pods, Deployments, Services (ClusterIP/NodePort), Ingress, Horizontal Pod Autoscaler (HPA) | ✅ **हाँ, 100% शामिल है**<br>(मॉड्यूल 1, 2, 4, 6, 7, और हमारे **System Design Lab** में लाइव चालू) |

---

## 📑 मास्टर विषय-सूची (Master Topic Index)

1. [मॉड्यूल 1: डिस्ट्रीब्यूटेड सिस्टम्स के बुनियादी सिद्धांत (Core Fundamentals)](#1-डिस्ट्रीब्यूटेड-सिस्टम्स-के-बुनियादी-सिद्धांत)
   - 1.1 Horizontal vs Vertical Scaling
   - 1.2 CAP Theorem और आधुनिक PACELC Theorem
   - 1.3 Consistent Hashing और Virtual Nodes
   - 1.4 Load Balancing Algorithms (L4 vs L7 Load Balancers)
2. [मॉड्यूल 2: एडवांस कैशिंग आर्किटेक्चर (Caching at Scale)](#2-एडवांस-कैशिंग-आर्किटेक्चर)
   - 2.1 Cache-Aside vs Write-Through vs Write-Back (Write-Behind)
   - 2.2 Cache Invalidation Strategies (TTL, Event-based, Purge)
   - 2.3 Cache Stampede (Dogpiling) और Mutex/Probabilistic Early Expiration (XFetch)
   - 2.4 Cache Eviction Policies (LRU, LFU, FIFO, 2Q)
   - 2.5 Redis Data Structures (Strings, Hashes, Lists, Sets, Sorted Sets - ZSET, HyperLogLog, Bitmaps)
3. [मॉड्यूल 3: मैसेज ब्रोकर्स और इवेंट स्ट्रीमिंग (Messaging & Async Queues)](#3-मैसेज-ब्रोकर्स-और-इवेंट-स्ट्रीमिंग)
   - 3.1 RabbitMQ vs Apache Kafka vs Redis BullMQ (गहन तुलना)
   - 3.2 Delivery Semantics (At-most-once, At-least-once, Exactly-once via Idempotency)
   - 3.3 Consumer Groups, Partitions, Rebalancing और Offsets (Kafka Internals)
   - 3.4 Dead Letter Queues (DLQ), Poison Pill Messages और Exponential Backoff
   - 3.5 Event Sourcing और CQRS (Command Query Responsibility Segregation)
4. [मॉड्यूल 4: डेटाबेस सिस्टम डिज़ाइन (Databases & Storage Architecture)](#4-डेटाबेस-सिस्टम-डिज़ाइन)
   - 4.1 SQL (ACID) vs NoSQL (BASE) — कब क्या चुनें?
   - 4.2 Database Sharding (Horizontal Partitioning) vs Vertical Partitioning
   - 4.3 Database Replication: Single-Leader, Multi-Leader, Leaderless (Quorum Reads/Writes: $W + R > N$)
   - 4.4 Replication Lag और Read-Your-Own-Writes Consistency
   - 4.5 Indexing Deep Dive: B-Tree vs LSM-Tree (Log-Structured Merge-tree in Kafka/Cassandra)
5. [मॉड्यूल 5: हाई-कॉनकरेंसी और रेस कंडीशंस (Concurrency & Distributed Locking)](#5-हाई-कॉनकरेंसी-और-रेस-कंडीशंस)
   - 5.1 Flash Sale Concurrency: Pessimistic vs Optimistic Locking
   - 5.2 Redis Redlock Algorithm और In-Memory Atomic Primitives (`DECR`/`INCR`)
   - 5.3 Distributed Transactions: 2-Phase Commit (2PC) vs Saga Pattern (Choreography vs Orchestration)
6. [मॉड्यूल 6: सिक्योरिटी, रेट लिमिटिंग और फॉल्ट टॉलरेंस (Resilience & Security)](#6-सिक्योरिटी-रेट-लिमिटिंग-और-फॉल्ट-टॉलरेंस)
   - 6.1 Rate Limiting Algorithms: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log, Sliding Window Counter
   - 6.2 Circuit Breaker Pattern (Closed, Open, Half-Open) & Bulkhead Pattern
   - 6.3 Idempotency Keys और Payment Double-Spend Prevention
   - 6.4 JWT Token Architecture: Access Token Memory Storage + HttpOnly Refresh Token Rotation + Redis Blacklist
   - 6.5 Webhook Security: HMAC SHA-256 Signatures, Replay Attacks और Nonce
7. [मॉड्यूल 7: प्रोडक्शन डेवऑप्स और स्केल (Docker, Kubernetes & Observability)](#7-प्रोडक्शन-डेवऑप्स-और-स्केल)
   - 7.1 Kubernetes Pods, Deployments, Services (ClusterIP vs NodePort vs LoadBalancer), Ingress
   - 7.2 Zero-Downtime Deployment: Rolling Update, Blue-Green, Canary Releases
   - 7.3 Auto-Scaling: Horizontal Pod Autoscaler (HPA) vs Cluster Autoscaler
   - 7.4 Observability Pillar: Metrics (Prometheus), Logs (ELK), Traces (Jaeger/OpenTelemetry)
8. [मॉड्यूल 8: टॉप 15 रियल इंटरव्यू केस स्टडीज (Real-World System Design Problems)](#8-टॉप-15-रियल-इंटरव्यू-केस-स्टडीज)

---

## 1. डिस्ट्रीब्यूटेड सिस्टम्स के बुनियादी सिद्धांत

### 1.1 Horizontal vs Vertical Scaling
- **Vertical Scaling (Scale-Up)**: सिंगल मशीन में अधिक RAM, CPU या SSD जोड़ना।
  - *फायदे*: कोई नेटवर्क लेटेंसी नहीं, कोड में बदलाव नहीं।
  - *नुकसान*: हार्डवेयर की भौतिक सीमा होती है (उदा. 128 Cores / 2TB RAM से ऊपर नहीं जा सकते)। Single Point of Failure (SPOF)।
- **Horizontal Scaling (Scale-Out)**: कई सस्ती कमोडिटी मशीनों (Instances/Pods) को लोड बैलेंसर के पीछे जोड़ना।
  - *फायदे*: अनंत स्केलिंग क्षमता, हाई अवेलेबिलिटी।
  - *नुकसान*: नेटवर्क लेटेंसी, डेटा सिंक, डिस्ट्रिब्यूटेड कंकरेंसी।

### 1.2 CAP Theorem और आधुनिक PACELC Theorem
- **CAP Theorem (Brewer's Theorem)**:
  किसी भी डिस्ट्रिब्यूटेड डेटा स्टोर में नेटवर्क पार्टीशन (**P**) होने पर आप केवल दो में से एक चुन सकते हैं:
  1. **Consistency (C)**: हर रीड रिक्वेस्ट पर हमेशा नवीनतम डेटा मिले या एरर आए।
  2. **Availability (A)**: हर नॉन-फेलिंग नोड बिना एरर के रेस्पॉन्स दे, चाहे डेटा थोड़ा पुराना क्यों न हो।
- **PACELC Theorem (4-5 Year Senior Question)**:
  CAP थ्योरम केवल नेटवर्क पार्टीशन के समय की बात करता है। लेकिन जब सामान्य स्थिति (Normal State) हो तब क्या?
  - **P-A / P-C**: अगर **P**artition है, तो **A**vailability चुनेंगे या **C**onsistency?
  - **E-L / E-C**: **E**lse (अगर पार्टीशन नहीं है), तो **L**atency चुनेंगे या **C**onsistency?
  - *उदाहरण*: MongoDB डिफ़ॉल्ट रूप से **PC/EC** है (Consistency पर जोर)। DynamoDB/Cassandra **PA/EL** हैं (Latency और Availability पर जोर)।

### 1.3 Consistent Hashing
- साधारण हैशिंग: `server_index = hash(key) % N` (जहाँ $N$ सर्वरों की संख्या है)।
  - *समस्या*: यदि एक सर्वर क्रैश हो जाए या नया सर्वर जोड़ा जाए ($N \to N+1$), तो लगभग 99% कीज़ अपनी लोकेशन बदल लेंगी। पूरी कैश खाली हो जाएगी (Cache Avalanche)।
- **Consistent Hashing समाधान**:
  - $0$ से $2^{32}-1$ की एक सर्कुलर हैश रिंग (Hash Ring) बनाई जाती है।
  - सर्वरों और कीज़ दोनों को इसी रिंग पर हैश किया जाता है।
  - कोई भी की अपनी घड़ी की दिशा (Clockwise) में निकटतम सर्वर पर स्टोर होती है।
  - **Virtual Nodes**: अगर नोड्स की संख्या कम हो तो डेटा अनइवन (Hotspot) हो सकता है। इसलिए प्रत्येक भौतिक सर्वर को 100-200 वर्चुअल नोड्स में रिंग पर फैलाया जाता है।

---

## 2. एडवांस कैशिंग आर्किटेक्चर

### 2.1 Caching Patterns
1. **Cache-Aside (Lazy Loading)** *(हमारे प्रोजेक्ट में उपयोग)*:
   - ऐप पहले कैश चेक करती है ➔ मिस होने पर DB से लाती है ➔ कैश में लिखती है।
   - *ट्रेड-ऑफ*: पहली बार लेटेंसी होती है, लेकिन केवल वही डेटा लोड होता है जिसकी ज़रूरत है।
2. **Write-Through**:
   - ऐप डेटा पहले कैश में लिखती है, कैश सिंक्रोनस रूप से DB में लिखता है।
   - *ट्रेड-ऑफ*: राइट लेटेंसी बढ़ती है, लेकिन कैश कभी स्टेल (Stale) नहीं होती।
3. **Write-Back (Write-Behind)**:
   - ऐप तुरंत कैश में लिखती है (1ms), और बैकग्राउंड वर्कर 5 सेकंड बाद बैच में DB में लिखता है।
   - *ट्रेड-ऑफ*: सबसे तेज़ राइट स्पीड, लेकिन अगर कैश सर्वर क्रैश हो गया तो डेटा लॉस का जोखिम रहता है।

### 2.2 Cache Stampede (Dogpiling / Thundering Herd)
- **समस्या**: अगर किसी बहुत लोकप्रिय की (उदा. 'iPhone Flash Sale') का TTL एक्सपायर हो जाए, तो एक ही मिलीसेकंड में आने वाली 50,000 रिक्वेस्ट्स एक साथ डेटाबेस पर क्वेरी चला देंगी और डेटाबेस क्रैश हो जाएगा।
- **समाधान**:
  1. **Mutex Lock (Redis SetNX)**: केवल पहला थ्रेड डेटाबेस से डेटा लाने का लॉक लेगा; बाकी 49,999 थ्रेड्स 50ms इंतज़ार करेंगे।
  2. **XFetch Algorithm (Probabilistic Early Expiration)**: TTL खत्म होने से पहले ही बैकग्राउंड में प्रोबेबिलिस्टिक तरीके से की को री-कैश कर देना।

---

## 3. मैसेज ब्रोकर्स और इवेंट स्ट्रीमिंग

### 3.1 RabbitMQ vs Kafka vs BullMQ
| पैरामीटर | RabbitMQ | Apache Kafka | BullMQ (Redis) |
|---|---|---|---|
| **मॉडल** | Smart Broker / Dumb Consumer | Dumb Broker / Smart Consumer (Log) | Redis In-Memory Worker Queue |
| **मैसेज पब्लिश स्पीड** | ~20,000 / sec | 1,000,000+ / sec | ~50,000 / sec |
| **री-प्ले क्षमता** | नहीं (ACK होते ही डिलीट) | हाँ (Offset पीछे करके दोबारा पढ़ सकते हैं) | नहीं |
| **उपयोग** | इंटर-सर्विस कमांड्स (Order -> Inventory) | क्लिकस्ट्रीम, लॉग्स, एनालिटिक्स | Node.js हैवी जॉब्स (PDF, SMS) |

### 3.2 Delivery Semantics और Idempotency
- **At-least-once**: मैसेज कभी नहीं छूटेगा, लेकिन नेटवर्क एरर के कारण दोबारा भेजा जा सकता है।
- **Exactly-once**: दुनिया के किसी भी नेटवर्क में भौतिक रूप से असंभव है! इसे केवल **At-least-once + Idempotent Consumer** के संयोजन से हासिल किया जाता है:
  - हर मैसेज में एक यूनीक `idempotency_key` (उदा. `order_id_123`) भेजी जाती है।
  - कंज्यूमर प्रोसेस करने से पहले Redis/DB में चेक करता है कि यह की पहले प्रोसेस हो चुकी है या नहीं।

---

## 4. डेटाबेस सिस्टम डिज़ाइन

### 4.1 B-Tree vs LSM-Tree (Log-Structured Merge-tree)
- **B-Tree** (MySQL, PostgreSQL, MongoDB WiredTiger):
  - डेटा को 4KB/8KB के फिक्स्ड पेजेस में स्टोर करता है।
  - *रीड*: अत्यंत तेज़ $O(\log N)$।
  - *राइट*: रैंडम डिस्क I/O की वजह से भारी राइट लोड पर धीमा।
- **LSM-Tree** (Kafka, Cassandra, RocksDB):
  - राइट्स को पहले मेमोरी में **MemTable** पर लिखा जाता है और डिस्क पर केवल अपेंड किया जाता है (**WAL - Write Ahead Log**)।
  - मेमोरी भर जाने पर इसे डिस्क पर **SSTable (Sorted String Table)** में फ्लश किया जाता है।
  - *राइट*: लगभग शून्य लेटेंसी (Sequential Write)।

### 4.2 Database Sharding Strategies
- **Range-Based Sharding**: उदा. यूजर ID 1-1M शार्ड A पर, 1M-2M शार्ड B पर।
  - *समस्या*: हॉटस्पॉट (नए यूजर्स हमेशा अंतिम शार्ड पर हमला करेंगे)।
- **Hash-Based Sharding**: `shard_id = hash(user_id) % num_shards`।
  - *फायदा*: डेटा का रिंग पर एक समान फैलाव।

---

## 5. हाई-कॉनकरेंसी और रेस कंडीशंस

### 5.1 Flash Sale Concurrency: Pessimistic vs Optimistic vs In-Memory Lock
1. **Pessimistic Locking (`SELECT FOR UPDATE`)**:
   - रो (Row) पर हार्डवेयर लॉक लगा देता है।
   - *परिणाम*: 10,000 यूजर्स लाइन में लग जाएंगे ➔ डेटाबेस कनेक्शन पूल समाप्त ➔ 504 Gateway Timeout।
2. **Optimistic Locking (`version = version + 1`)**:
   - कोई लॉक नहीं। अपडेट करते समय चेक होता है कि क्या वर्जन बदला।
   - *परिणाम*: 1 सफल होगा, 9,999 यूजर्स को रोलबैक एरर मिलेगा। डेटाबेस CPU 100% पर चला जाएगा।
3. **In-Memory Atomic Decrement (Redis `DECR`)** *(हमारा आर्किटेक्चर)*:
   - डेटाबेस को छूने की ज़रूरत नहीं। Redis सिंगल थ्रेड में रैम पर 0.1ms में `DECR` करता है।
   - केवल सफल 50 खरीदारों की रिक्वेस्ट्स पृष्ठभूमि में BullMQ द्वारा डेटाबेस में लिखी जाती हैं।

---

## 6. सिक्योरिटी, रेट लिमिटिंग और फॉल्ट टॉलरेंस

### 6.1 रेट लिमिटिंग एल्गोरिदम की तुलना
1. **Token Bucket**: निश्चित दर पर टोकन भरते हैं। बर्स्ट ट्रैफिक की अनुमति देता है।
2. **Leaky Bucket**: फिक्स्ड स्पीड से रिक्वेस्ट्स बाहर निकालता है। स्मूथ आउटपुट।
3. **Sliding Window Log via Redis Sorted Sets (`ZSET`)**:
   - $t_{now} - 60s$ से पहले के सभी स्कोर्स को हटाता है।
   - हर मिलीसेकंड सटीक विंडो की गणना करता है। कोई बाउंड्री स्पाइक नहीं हो सकती।

### 6.2 Circuit Breaker स्टेट मशीन
```
   [NORMAL TRAFFIC]
          │
          ▼
     ┌──────────┐   Failure Rate > 50%    ┌──────────┐
     │  CLOSED  │ ──────────────────────> │   OPEN   │ (Fails Fast without calling DB)
     └──────────┘                         └──────────┘
          ▲                                     │
          │                                     │ Sleep Window Expired (e.g. 10s)
          │                                     ▼
          │  Success Rate > 90%           ┌──────────┐
          └────────────────────────────── │HALF-OPEN │ (Sends 5% probe traffic)
                                          └──────────┘
```

---

---

## 🟢 Node.js Masterclass: 1 से 5 साल के अनुभव के सभी टॉपिक्स (Junior to Staff Level)

| अनुभव स्तर | Node.js इंटरव्यू टॉपिक्स (Core Internals & Deep Dives) | इंटरव्यूअर के पसंदीदा सवाल (Questions & Key Answers) |
|---|---|---|
| **1-2 Years (Junior)** | • **Node.js Architecture**: V8 Engine vs Libuv, Single-Threaded Event Loop Base<br>• **Asynchronous JavaScript**: Callbacks, Promises, `async/await`, Error First Callbacks<br>• **Core Modules**: `fs`, `path`, `http`, `events` (EventEmitter), `crypto`<br>• **Express.js Fundamentals**: Middleware chain (`(req, res, next)`), Route Handlers, Error Handling Middleware | **Q: Node.js सिंगल थ्रेडेड है तो मल्टीपल रिक्वेस्ट्स कैसे हैंडल करता है?**<br>*A: Node का JavaScript थ्रेड सिंगल है, लेकिन नेटवर्क/फाइल I/O को Libuv अपने C++ थ्रेड पूल (डिफ़ॉल्ट 4 थ्रेड्स) को सौंप देता है। नॉन-ब्लॉकिंग I/O की वजह से थ्रेड कभी खाली नहीं बैठता।* |
| **2-3 Years (Mid-Level)** | • **Event Loop Phases (गहराई से)**: Timers ➔ Pending Callbacks ➔ Idle/Prepare ➔ Poll ➔ Check (`setImmediate`) ➔ Close Callbacks<br>• **Microtasks vs Macrotasks**: `process.nextTick()` vs `Promise.then()` vs `setTimeout()` (nextTick सबसे पहले एग्जीक्यूट होता है)<br>• **Streams & Buffer Architecture**: Readable, Writable, Transform, Duplex Streams; `pipe()`, Backpressure handling<br>• **Memory Leaks**: Event Listeners unremoved, Global Variables, Closures; Heap Snapshot via Chrome DevTools | **Q: `process.nextTick()` और `setImmediate()` में क्या फर्क है?**<br>*A: `process.nextTick()` वर्तमान ऑपरेशन के तुरंत बाद (इवेंट लूप का अगला फेज शुरू होने से पहले) चलता है। जबकि `setImmediate()` इवेंट लूप के 'Check' फेज में चलता है।* |
| **3-4 Years (Senior SDE-2)** | • **Multi-Threading & Clustering**: `cluster` मॉड्यूल (Master-Worker IPC), `worker_threads` (CPU-इंटेंसिव टास्क्स जैसे इमेज/क्रिप्टो के लिए)<br>• **Thread Pool Tuning**: `UV_THREADPOOL_SIZE` (4 से बढ़ाकर 64 या 128 करना)<br>• **Garbage Collection (V8)**: Generational GC (Scavenge / Semi-space for Young generation, Mark-Sweep-Compact for Old generation)<br>• **Security Hardening**: Prototype Pollution, ReDoS (Regex Denial of Service), Helmet, CORS pre-flight, Timing Attacks on crypto comparisons | **Q: CPU-Intensive काम (जैसे PDF Generation/Hashing) Node.js में कैसे करेंगे बिना इवेंट लूप ब्लॉक किए?**<br>*A: `worker_threads` का उपयोग करके या हमारे प्रोजेक्ट की तरह Redis-backed `BullMQ` बैकग्राउंड क्यू को सौंपकर।* |
| **4-5 Years (Lead / Staff)** | • **High Performance Profiling**: Clinic.js (`clinic doctor`, `clinic flame`), V8 CPU Profiler, Flamegraphs<br>• **Memory Architecture**: Heap vs Stack, V8 Max Old Space (`--max-old-space-size=4096`), Out-of-Memory (OOM) Crashes रोकथाम<br>• **Graceful Shutdown**: `SIGTERM` / `SIGINT` लिसनर, Active HTTP Connections ड्रेन करना, DB / Redis पूल्स को सुरक्षित बंद करना<br>• **Native C++ Addons (N-API)**: जब Node.js को C++ लाइब्रेरी से सीधे कनेक्ट करना हो | **Q: प्रोडक्शन में Node.js ऐप का Graceful Shutdown कैसे लागू करते हैं?**<br>*A: `process.on('SIGTERM')` पकड़ते हैं, `server.close()` कॉल करते हैं ताकि नई रिक्वेस्ट्स रुकें और पुरानी पूरी हों, फिर DB/Redis क्लोज करके 10s टाइमआउट पर `process.exit(0)` करते हैं।* |

---

## 🍃 MongoDB Masterclass: 1 से 5 साल के अनुभव के सभी टॉपिक्स (Junior to Staff Level)

| अनुभव स्तर | MongoDB इंटरव्यू टॉपिक्स (Internals, Schema Design & Scaling) | इंटरव्यूअर के पसंदीदा सवाल (Questions & Key Answers) |
|---|---|---|
| **1-2 Years (Junior)** | • **Document Model**: BSON vs JSON, ObjectIDs की आंतरिक संरचना (4-byte timestamp + 5-byte random + 3-byte counter)<br>• **CRUD & Mongoose**: Schema Validation, Pre/Post Hooks, Methods, Virtuals<br>• **Basic Querying**: Filters (`$eq`, `$gt`, `$in`), Projections, Sorting, Pagination (`skip()` / `limit()`) | **Q: MongoDB में ObjectID कैसे बनता है? क्या यह सच में यूनीक होता है?**<br>*A: यह 12 बाइट्स का होता है: 4 बाइट्स टाइमस्टैम्प (सेकंड्स में), 5 बाइट्स मशीन/प्रोसेस यूनीक वैल्यू, 3 बाइट्स ऑटो-इंक्रीमेंटिंग काउंटर। यह डिस्ट्रिब्यूटेड सिस्टम में बिना सेंट्रल सर्वर के यूनीक आईडी देता है।* |
| **2-3 Years (Mid-Level)** | • **Advanced Indexing**: Single Field, Compound Index (`{ category: 1, status: 1 }`), Multikey Index (Arrays पर), TTL Index, Partial Index<br>• **Index Performance (ESR Rule)**: **E**quality ➔ **S**ort ➔ **R**ange (इंडेक्स फील्ड्स का क्रम)<br>• **Execution Analysis**: `.explain("executionStats")` — `IXSCAN` (Index Scan) vs `COLLSCAN` (पूरा टेबल स्कैन, जो धीमा है)<br>• **Aggregation Pipeline**: `$match`, `$group`, `$lookup` (Left Outer Join), `$unwind`, `$project`, `$facet` (पैरेलल एग्रीगेशन) | **Q: `.explain("executionStats")` में सबसे महत्वपूर्ण मैट्रिक्स क्या देखते हैं?**<br>*A: `totalDocsExamined` बनाम `nReturned`। यदि 1 डॉक्यूमेंट पाने के लिए 10,000 डॉक्यूमेंट्स एग्जामिन हुए, तो इंडेक्स मिसिंग है। आदर्श स्थिति `totalKeysExamined == nReturned` और `totalDocsExamined == nReturned` है।* |
| **3-4 Years (Senior SDE-2)** | • **WiredTiger Storage Engine**: Cache Size (50% RAM), Checkpoints (हर 60 सेकंड में), Journaling (WAL - क्रैश रिकवरी)<br>• **Transactions & ACID (v4.0+)**: Multi-Document ACID Transactions via Two-Phase Commits under Session (`session.startTransaction()`)<br>• **Schema Design Patterns**: Embedding (1-to-Few) vs Referencing (1-to-Many / 1-to-Millions), Bucket Pattern (Time-series / IOT डेटा के लिए), Subset Pattern | **Q: Embedding vs Referencing में कब क्या चुनेंगे?**<br>*A: अगर डेटा का आकार 16MB की लिमिट पार नहीं करेगा और हमेशा पैरेंट के साथ ही पढ़ा जाएगा (उदा. Order Items), तो Embed करें। अगर चाइल्ड रिकॉर्ड्स लाखों में बढ़ सकते हैं (उदा. User Logs / Comments), तो Reference करें।* |
| **5 Years (Senior / Lead)** | • **Sharding Architecture**: Mongos (Router) ➔ Config Servers (Metadata) ➔ Shard Replica Sets (Data)<br>• **Shard Key Selection**: High Cardinality + Even Distribution (उदा. कभी `createdAt` को शार्ड की न बनाएं क्योंकि नया सारा डेटा सिर्फ एक ही शार्ड पर जाएगा - Monotonic Hotspot)<br>• **Replication & Consensus**: Raft-like Election Protocol, Oplog (Operations Log) Size, Write Concern (`w: "majority"`, `j: true`), Read Concern (`"majority"`, `"linearizable"`)<br>• **Connection Pooling**: `maxPoolSize` ट्यूनिंग, Socket Timeouts, Network Buffering | **Q: MongoDB में Write Concern `w: "majority"` और `j: true` का क्या मतलब है?**<br>*A: `w: "majority"` का अर्थ है कि राइट तभी सफल माना जाएगा जब रेप्लिका सेट के आधे से अधिक नोड्स पर लिखा जा चुका हो। `j: true` का अर्थ है कि डेटा डिस्क के जर्नल (WAL) में लिखा जा चुका है, यानी बिजली जाने पर भी डेटा लॉस शून्य होगा।* |

---

## 🏛️ टॉप 15 रियल इंटरव्यू केस स्टडीज (Real-World System Design Problems)

1. **Design a High-Concurrency B2B Flash Sale & E-Commerce Platform** *(यह पूरा प्रोजेक्ट)*
2. **Design an Idempotent Payment Webhook Service (Stripe / Razorpay)**
3. **Design a Real-Time Delivery Tracking System (Uber / DoorDash / FedEx Logistics)**
4. **Design a Distributed Rate Limiter (Cloudflare / API Gateway)**
5. **Design a Distributed Task Scheduler & Queue (BullMQ / AWS SQS)**
6. **Design URL Shortener (TinyURL) with 100M Daily Active Users**
7. **Design YouTube / Netflix Video Streaming Pipeline & Transcoding**
8. **Design WhatsApp / Slack Real-Time Chat Engine with WebSockets**
9. **Design Instagram / Twitter News Feed with Fan-Out-On-Write vs Fan-Out-On-Read**
10. **Design Web Crawler at Internet Scale (Googlebot)**
11. **Design Distributed Cache like Redis from Scratch**
12. **Design Typeahead / Auto-Complete Search Suggestions using Trie & Redis ZSET**
13. **Design Collaborative Text Editor (Google Docs) using CRDT / Operational Transformation**
14. **Design Distributed Unique ID Generator (Twitter Snowflake ID at 64-bit)**
15. **Design Real-Time Analytics Stream Processor using Apache Kafka & ClickHouse**

---

*यह फ़ाइल आपके सिस्टम डिज़ाइन इंटरव्यू की तैयारी के लिए सबसे प्रमाणिक और संपूर्ण संदर्भ है।*

