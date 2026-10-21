/**
 * SoloOS Modal: Contract Integrated Detail Modal
 * Inspect project alignment, milestones, delivery timeline, and inspection dates
 */

    // 4. 계약 통합 상세 모달 (페이지 이동 없이 실시간 얼라인 상태 검토)
    function openContractDetailModal(id, projectName, clientName, totalAmount, unpaidAmount, deliveryDate, inspectionDate) {
      const modal = document.getElementById('contractDetailModal');
      if (!modal) return;

      const pTitle = document.getElementById('cdmProjectTitle');
      const cName = document.getElementById('cdmClientName');
      const tAmt = document.getElementById('cdmTotalAmount');
      const uAmt = document.getElementById('cdmUnpaidAmount');
      const dDate = document.getElementById('cdmDeliveryDate');

      if (pTitle) pTitle.textContent = `${projectName} (계약 연동 상세)`;
      if (cName) cName.textContent = clientName || '고객사';
      if (tAmt) tAmt.textContent = `₩${(Number(totalAmount) || 0).toLocaleString()}`;
      if (uAmt) uAmt.textContent = `₩${(Number(unpaidAmount) || 0).toLocaleString()}`;
      if (dDate) dDate.textContent = deliveryDate || '2026-10-31';

      modal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }

    function closeContractDetailModal() {
      const modal = document.getElementById('contractDetailModal');
      if (modal) modal.classList.add('hidden');
    }



// Expose contract detail modal to global window
window.openContractDetailModal = openContractDetailModal;
window.closeContractDetailModal = closeContractDetailModal;
